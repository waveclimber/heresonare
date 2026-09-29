"use client";
import { useEffect, useState } from "react";
import { editorialContent } from "@/data/editorialContent";
import { platformContent } from "@/data/platformContent";
import type { Locale, MediaAsset } from "@/platform/domain";
import CoverImage from "./CoverImage";
import { usePlatformRequest } from "./usePlatformRequest";
export default function MediaLibrary({
  locale,
  media,
  refresh,
  onBusy,
}: {
  locale: Locale;
  media: MediaAsset[];
  refresh(): void;
  onBusy(value: boolean): void;
}) {
  const e = editorialContent[locale],
    c = platformContent[locale],
    api = usePlatformRequest(c);
  const [reading, setReading] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    onBusy(reading || api.busy);
    return () => onBusy(false);
  }, [reading, api.busy, onBusy]);
  return (
    <div className="p-stack">
      <p>{e.imageHelp}</p>
      <form
        method="post"
        className="p-form"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget,
            data = new FormData(form),
            file = data.get("file");
          setError("");
          setNotice("");
          if (
            !(file instanceof File) ||
            !file.size ||
            file.size > 2 * 1024 * 1024
          ) {
            setError(c.errors["too-large"]);
            return;
          }
          setReading(true);
          try {
            const encoded = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve(String(reader.result).split(",")[1]);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            if (
              await api.request("/api/platform/media", {
                name: data.get("name"),
                data: encoded,
                rights: data.get("rights") === "on",
              })
            ) {
              form.reset();
              setNotice(c.saved);
              refresh();
            }
          } catch {
            setError(e.uploadFailed);
          } finally {
            setReading(false);
          }
        }}
      >
        <label className="p-field">
          {e.imageName}
          <input name="name" required maxLength={120} />
        </label>
        <label className="p-field">
          {e.imageFile}
          <input
            type="file"
            name="file"
            required
            accept="image/jpeg,image/png,image/webp"
          />
        </label>
        <label className="p-check">
          <input type="checkbox" name="rights" required />
          {e.rights}
        </label>
        <button
          className="p-button p-primary"
          disabled={!api.ready || api.busy || reading}
        >
          {api.busy || reading ? c.working : e.upload}
        </button>
      </form>
      {(api.error || error) && (
        <p role="alert" className="p-notice p-error">
          {api.error || error}
        </p>
      )}
      {notice && (
        <p role="status" className="p-notice">
          {notice}
        </p>
      )}
      <p>
        {e.mediaCount}: {media.length} / 200
      </p>
      <div className="p-grid">
        {media.map((asset) => (
          <article className="p-card" key={asset.id}>
            <CoverImage
              cover={{
                id: asset.id,
                alt: { en: asset.name, ja: asset.name, "zh-cn": asset.name },
              }}
              locale={locale}
            />
            <h3>{asset.name}</h3>
            <p>
              {asset.width} × {asset.height} · {Math.ceil(asset.bytes / 1024)}{" "}
              KB
            </p>
            {deleting === asset.id ? (
              <div
                className="p-confirm"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setDeleting(null);
                }}
              >
                <p>{c.confirmDelete}</p>
                <div className="p-row">
                  <button
                    autoFocus
                    className="p-button"
                    onClick={() => setDeleting(null)}
                  >
                    {c.cancel}
                  </button>
                  <button
                    className="p-button"
                    disabled={api.busy}
                    onClick={async () => {
                      if (
                        await api.request("/api/platform/admin", {
                          action: "media-delete",
                          id: asset.id,
                        })
                      ) {
                        setDeleting(null);
                        setNotice(e.deletedImage);
                        refresh();
                      }
                    }}
                  >
                    {c.confirm}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="p-button"
                disabled={reading || api.busy}
                onClick={() => setDeleting(asset.id)}
              >
                {c.delete}
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
