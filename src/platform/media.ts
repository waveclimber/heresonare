import sharp, { type OutputInfo } from "sharp";
import { randomUUID } from "node:crypto";
import { object, text, PlatformError, type MediaAsset } from "./domain";
import { audit, sessionValid, throttle } from "./security";
import type { Store } from "./store";

export async function uploadMedia(
  store: Store,
  token: string | undefined,
  value: unknown,
) {
  if (!sessionValid(await store.read(), token))
    throw new PlatformError("unauthorized", 401);
  await throttle(store, "media-upload", 30, 60 * 60 * 1000);
  const input = object(value);
  if (input.rights !== true) throw new PlatformError("media-rights-required");
  const name = text(input.name, 120, true);
  const encoded = text(input.data, 2800000, true);
  if (!/^[A-Za-z0-9+/]+={0,2}$/u.test(encoded))
    throw new PlatformError("invalid-media");
  const source = Buffer.from(encoded, "base64");
  if (source.length > 2 * 1024 * 1024)
    throw new PlatformError("too-large", 413);
  // Reject active/document formats before the image decoder sees them.
  const raster =
    source.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ||
    source
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
    (source.toString("ascii", 0, 4) === "RIFF" &&
      source.toString("ascii", 8, 12) === "WEBP");
  if (!raster) throw new PlatformError("invalid-media");
  let output: { data: Buffer; info: OutputInfo };
  try {
    const image = sharp(source, {
      limitInputPixels: 20000000,
      failOn: "warning",
    });
    const metadata = await image.metadata();
    if ((metadata.pages ?? 1) !== 1) throw new Error("animation");
    output = await image
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .timeout({ seconds: 10 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new PlatformError("invalid-media");
  }
  if (output.data.length > 524288) throw new PlatformError("too-large", 413);
  const asset: MediaAsset = {
    id: randomUUID(),
    name,
    width: output.info.width,
    height: output.info.height,
    bytes: output.data.length,
    createdAt: new Date().toISOString(),
  };
  return store.change(async (state, assets) => {
    if (!sessionValid(state, token))
      throw new PlatformError("unauthorized", 401);
    state.media ??= [];
    if (state.media.length >= 200) throw new PlatformError("capacity", 409);
    await assets.put(asset.id, output.data);
    state.media.unshift(asset);
    audit(state, "media-upload", asset.id);
    return { id: asset.id };
  });
}

export async function readMedia(
  store: Store,
  token: string | undefined,
  id: string,
) {
  const state = await store.read();
  const asset = state.media?.find((item) => item.id === id);
  if (
    !asset ||
    (!sessionValid(state, token) &&
      !state.records.some((record) => record.published?.cover?.id === id))
  )
    throw new PlatformError("not-found", 404);
  const data = await store.readAsset(id);
  if (!data) throw new PlatformError("not-found", 404);
  return data;
}
