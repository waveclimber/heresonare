import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const projectRoot = process.cwd();
const applicationRoots = ["src/app", "src/components", "src/lib"];
const sourceExtensions = new Set([".ts", ".tsx"]);
const runtimeStaticContentImport =
  /import\s+(?!type\b)[^;]*?from\s+["']@\/data\/(?:siteContent|pageContent|productionContent)["'];?/gs;
const repositoryImport = /from\s+["']@\/content\/repository["']/;

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) return collectSourceFiles(path);
    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

const applicationFiles = applicationRoots.flatMap((root) =>
  collectSourceFiles(join(projectRoot, root)),
);
const violations = [];

for (const file of applicationFiles) {
  const source = readFileSync(file, "utf8");
  const filePath = relative(projectRoot, file).replaceAll("\\", "/");

  if (runtimeStaticContentImport.test(source)) {
    violations.push(`${filePath} imports static content outside the repository.`);
  }
  runtimeStaticContentImport.lastIndex = 0;

  if (
    /^[\s\r\n]*["']use client["'];/.test(source) &&
    repositoryImport.test(source)
  ) {
    violations.push(`${filePath} imports the server-only content repository.`);
  }
}

for (const repositoryFile of [
  "src/content/repository.ts",
  "src/content/staticContentRepository.ts",
]) {
  const source = readFileSync(join(projectRoot, repositoryFile), "utf8");
  assert.match(
    source,
    /import\s+["']server-only["'];/,
    `${repositoryFile} must remain server-only.`,
  );
}

assert.deepEqual(violations, [], violations.join("\n"));

console.log(
  `Content boundary passed (${applicationFiles.length} application modules checked).`,
);
