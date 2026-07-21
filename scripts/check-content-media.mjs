import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { extname, join, relative, sep } from "node:path";

const projectRoot = process.cwd();
const publicDirectory = join(projectRoot, "public");
const pageContentPath = join(projectRoot, "src/data/pageContent.ts");
const allowlistPath = join(
  projectRoot,
  "src/data/approvedContentMedia.json",
);
const controlledRoots = [
  "/images/artists/",
  "/images/music/",
  "/images/placeholders/",
  "/images/products/",
  "/images/tour/",
  "/images/venues/",
  "/images/video/",
  "/images/store/",
];
const approvableRoots = controlledRoots.filter(
  (root) => root !== "/images/placeholders/",
);
const supportedExtensions = new Set([
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);
const maximumBytes = {
  icon: 100 * 1024,
  raster: 700 * 1024,
};

function toPublicPath(filePath) {
  return `/${relative(publicDirectory, filePath).split(sep).join("/")}`;
}

function collectFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

function isControlledPath(path) {
  return controlledRoots.some((root) => path.startsWith(root));
}

function isApprovablePath(path) {
  return approvableRoots.some((root) => path.startsWith(root));
}

function formatKilobytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const failures = [];
const allowlistedPaths = JSON.parse(readFileSync(allowlistPath, "utf8"));

if (
  !Array.isArray(allowlistedPaths) ||
  allowlistedPaths.some((path) => typeof path !== "string")
) {
  throw new Error("approvedContentMedia.json must be an array of paths.");
}

const duplicatePaths = allowlistedPaths.filter(
  (path, index) => allowlistedPaths.indexOf(path) !== index,
);
if (duplicatePaths.length > 0) {
  failures.push(
    `Duplicate approved paths: ${[...new Set(duplicatePaths)].join(", ")}`,
  );
}

const pageContentSource = readFileSync(pageContentPath, "utf8");
const referencedPaths = [
  ...new Set(
    [
      ...pageContentSource.matchAll(
        /["'](\/images\/[^"']+\.(?:avif|jpe?g|png|svg|webp))["']/giu,
      ),
    ].map(([, path]) => path),
  ),
];
const approvedSet = new Set(allowlistedPaths);
const publicFiles = collectFiles(join(publicDirectory, "images"));
const publicPathByLowerCase = new Map(
  publicFiles.map((filePath) => [
    toPublicPath(filePath).toLowerCase(),
    toPublicPath(filePath),
  ]),
);
const controlledPublicPaths = publicFiles
  .map(toPublicPath)
  .filter(isControlledPath);

for (const path of allowlistedPaths) {
  const extension = extname(path).toLowerCase();
  const actualCasePath = publicPathByLowerCase.get(path.toLowerCase());

  if (
    !path.startsWith("/") ||
    path.includes("..") ||
    path.includes("?") ||
    path.includes("#")
  ) {
    failures.push(`Unsafe approved path: ${path}`);
    continue;
  }

  if (!isApprovablePath(path)) {
    failures.push(
      `Approved path is outside an approvable content directory: ${path}`,
    );
  }
  if (!supportedExtensions.has(extension)) {
    failures.push(`Unsupported approved extension: ${path}`);
  }
  if (!actualCasePath) {
    failures.push(`Approved file is missing from public/: ${path}`);
    continue;
  }
  if (actualCasePath !== path) {
    failures.push(
      `Approved path casing does not match the file: ${path} -> ${actualCasePath}`,
    );
  }
  if (!referencedPaths.includes(path)) {
    failures.push(`Approved file is not referenced by page content: ${path}`);
  }

  const fileBytes = statSync(join(publicDirectory, path.slice(1))).size;
  const byteLimit =
    extension === ".svg" ? maximumBytes.icon : maximumBytes.raster;
  if (fileBytes > byteLimit) {
    failures.push(
      `Approved file is too large: ${path} (${formatKilobytes(fileBytes)} > ${formatKilobytes(byteLimit)})`,
    );
  }
}

for (const path of controlledPublicPaths) {
  if (!approvedSet.has(path)) {
    failures.push(`Content file exists but is not approved: ${path}`);
  }
}

const pendingReferences = referencedPaths.filter(
  (path) => !approvedSet.has(path),
);
const approvedReferences = referencedPaths.filter((path) =>
  approvedSet.has(path),
);

console.log("\nContent media readiness\n");
console.table([
  {
    "Approved media": approvedReferences.length,
    "Pending references": pendingReferences.length,
    "Controlled public files": controlledPublicPaths.length,
  },
]);

if (pendingReferences.length > 0) {
  console.log("Pending media paths (fallback remains active):");
  for (const path of pendingReferences) console.log(`- ${path}`);
}

if (failures.length > 0) {
  console.error("\nContent media contract failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nContent media approval contract passed.");
}
