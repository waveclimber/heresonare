import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const workflowPath = join(projectRoot, ".github", "workflows", "quality.yml");
const workflow = readFileSync(workflowPath, "utf8");

const expectedActions = new Map([
  [
    "actions/checkout",
    {
      sha: "3d3c42e5aac5ba805825da76410c181273ba90b1",
      version: "v7.0.1",
    },
  ],
  [
    "actions/setup-node",
    {
      sha: "48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e",
      version: "v6.4.0",
    },
  ],
]);

assert.doesNotMatch(
  workflow,
  /^\s*pull_request_target\s*:/mu,
  "The quality workflow must not execute untrusted pull-request code with pull_request_target.",
);
assert.match(
  workflow,
  /^permissions:\s*\r?\n\s+contents:\s*read\s*$/mu,
  "The quality workflow must keep the default token read-only.",
);
assert.doesNotMatch(
  workflow,
  /^\s+[a-z-]+:\s*write\s*$/gmu,
  "The quality workflow must not grant write permissions.",
);
assert.match(
  workflow,
  /^\s+runs-on:\s*ubuntu-24\.04\s*$/mu,
  "The quality job must use the reviewed Ubuntu runner baseline.",
);
assert.match(
  workflow,
  /^\s+timeout-minutes:\s*15\s*$/mu,
  "The quality job must retain its execution timeout.",
);
assert.match(
  workflow,
  /^concurrency:\s*\r?\n\s+group:\s*quality-\$\{\{ github\.workflow \}\}-\$\{\{ github\.head_ref \|\| github\.ref \}\}\s*\r?\n\s+cancel-in-progress:\s*true\s*$/mu,
  "The quality workflow must cancel superseded runs on the same ref.",
);

const usesEntries = [...workflow.matchAll(/^\s*uses:\s*([^\s#]+)(?:\s+#\s*(\S+))?\s*$/gmu)];
assert.equal(
  usesEntries.length,
  expectedActions.size,
  "The quality workflow contains an unexpected number of external actions.",
);

for (const [, reference, versionComment] of usesEntries) {
  const separatorIndex = reference.lastIndexOf("@");
  const action = reference.slice(0, separatorIndex);
  const revision = reference.slice(separatorIndex + 1);
  const expected = expectedActions.get(action);

  assert.ok(expected, `Unexpected external action: ${action}.`);
  assert.match(
    revision,
    /^[0-9a-f]{40}$/u,
    `${action} must use an immutable full commit SHA.`,
  );
  assert.equal(revision, expected.sha, `${action} is not on the reviewed commit.`);
  assert.equal(
    versionComment,
    expected.version,
    `${action} must retain its human-readable release comment.`,
  );
}

const checkoutStep = getStep("Check out repository");
assert.match(
  checkoutStep,
  /^\s+persist-credentials:\s*false\s*$/mu,
  "Checkout credentials must not persist after the checkout step.",
);

const setupNodeStep = getStep("Set up Node.js");
assert.match(
  setupNodeStep,
  /^\s+node-version-file:\s*\.nvmrc\s*$/mu,
  "CI must read the Node.js baseline from .nvmrc.",
);
assert.match(
  setupNodeStep,
  /^\s+cache:\s*npm\s*$/mu,
  "CI must retain lockfile-based npm caching.",
);
assert.doesNotMatch(
  setupNodeStep,
  /^\s+node-version:\s*/mu,
  "CI must not duplicate the Node.js version outside .nvmrc.",
);

const auditStep = getStep(
  "Reject critical production dependency vulnerabilities",
);
assert.match(
  auditStep,
  /^\s+run:\s*npm audit --omit=dev --audit-level=critical\s*$/mu,
  "CI must fail when a critical production dependency advisory appears.",
);

console.log(
  `CI security contract passed (${usesEntries.length} immutable actions, read-only token, critical audit gate).`,
);

function getStep(name) {
  const marker = `      - name: ${name}`;
  const startIndex = workflow.indexOf(marker);
  assert.notEqual(startIndex, -1, `Missing workflow step: ${name}.`);

  const nextStepIndex = workflow.indexOf("\n      - name:", startIndex + 1);
  return workflow.slice(
    startIndex,
    nextStepIndex === -1 ? workflow.length : nextStepIndex,
  );
}
