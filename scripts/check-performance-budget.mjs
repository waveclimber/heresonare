import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { extname, join } from "node:path";

const buildDirectory = join(process.cwd(), ".next");
const routeSamples = [
  { route: "/en", output: "server/app/en.html" },
  { route: "/en/productions", output: "server/app/en/productions.html" },
  {
    route: "/en/productions/audio-innovation",
    output: "server/app/en/productions/audio-innovation.html",
  },
];

const budgets = {
  html: 10 * 1024,
  js: 260 * 1024,
  css: 12 * 1024,
  fonts: 56 * 1024,
};

function gzipSize(path) {
  return gzipSync(readFileSync(path), { level: 9 }).byteLength;
}

function formatKilobytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function measureRoute({ route, output }) {
  const htmlPath = join(buildDirectory, output);
  const html = readFileSync(htmlPath, "utf8");
  const assetUrls = [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/[^"'<>\\\s]+/g)].map(
        ([assetUrl]) => assetUrl.split("?")[0],
      ),
    ),
  ];
  const totals = { html: gzipSize(htmlPath), js: 0, css: 0, fonts: 0 };

  for (const assetUrl of assetUrls) {
    const assetPath = join(
      buildDirectory,
      assetUrl.slice("/_next/".length),
    );
    const extension = extname(assetPath).toLowerCase();

    if (extension === ".js") totals.js += gzipSize(assetPath);
    if (extension === ".css") totals.css += gzipSize(assetPath);
    if (extension === ".woff2") totals.fonts += statSync(assetPath).size;
  }

  return { route, totals };
}

const measurements = routeSamples.map(measureRoute);
const failures = [];

console.log("\nProduction asset budget (unique assets referenced by HTML)\n");
console.table(
  measurements.map(({ route, totals }) => ({
    Route: route,
    "HTML gzip": formatKilobytes(totals.html),
    "JS gzip": formatKilobytes(totals.js),
    "CSS gzip": formatKilobytes(totals.css),
    Fonts: formatKilobytes(totals.fonts),
  })),
);

for (const { route, totals } of measurements) {
  for (const [type, limit] of Object.entries(budgets)) {
    if (totals[type] > limit) {
      failures.push(
        `${route} ${type.toUpperCase()}: ${formatKilobytes(totals[type])} exceeds ${formatKilobytes(limit)}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Performance budget exceeded:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("All representative routes are within budget.");
}
