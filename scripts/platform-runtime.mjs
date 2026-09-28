import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
export async function loadPlatform() {
  const directory = resolve(".next/platform-tools");
  await mkdir(directory, { recursive: true });
  for (const name of ["domain", "store", "security", "service"]) {
    const source = (
      await readFile(resolve(`src/platform/${name}.ts`), "utf8")
    ).replace(
      /from "\.\/(domain|store|security|service)"/gu,
      'from "./$1.mjs"',
    );
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ES2022,
      },
    });
    await writeFile(resolve(directory, `${name}.mjs`), outputText);
  }
  return Object.assign(
    {},
    ...(await Promise.all(
      ["domain", "store", "security", "service"].map(
        (name) => import(pathToFileURL(resolve(directory, `${name}.mjs`)).href),
      ),
    )),
  );
}
