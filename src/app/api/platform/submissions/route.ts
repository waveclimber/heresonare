import { readJson } from "@/platform/security";
import { submit } from "@/platform/service";
import { getStore } from "@/platform/store";
import { failure, json } from "@/platform/server";
export async function POST(request: Request) {
  try {
    return json(await submit(getStore(), await readJson(request)), 201);
  } catch (error) {
    return failure(error);
  }
}
