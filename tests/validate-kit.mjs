import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const mustExist = [
  "LICENSE",
  "package.json",
  "scripts/validate-kit.mjs",
];

for (const file of mustExist) {
  assert.ok(existsSync(file), `${file} should exist`);
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
assert.equal(packageJson.scripts?.test, "node tests/validate-kit.mjs");
assert.equal(packageJson.scripts?.validate, "node scripts/validate-kit.mjs");

const gitLog = spawnSync("git", ["log", "--format=%an%x00%ae"], {
  encoding: "utf8",
  stdio: "pipe",
});

if (gitLog.status === 0 && gitLog.stdout.trim()) {
  for (const row of gitLog.stdout.trim().split(/\r?\n/)) {
    const [authorName, authorEmail] = row.split("\0");
    assert.ok(
      authorName === "Agent Loop Harness Kit Contributors",
      "git author name should use the generic release identity",
    );
    assert.ok(
      authorEmail === "noreply@example.com",
      "git author email should use the generic release identity",
    );
  }
}

const validation = spawnSync("node", ["scripts/validate-kit.mjs"], {
  encoding: "utf8",
  stdio: "pipe",
});

assert.equal(
  validation.status,
  0,
  `validation should pass\nstdout:\n${validation.stdout}\nstderr:\n${validation.stderr}`,
);
