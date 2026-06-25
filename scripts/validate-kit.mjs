import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const requiredFiles = [
  "LICENSE",
  "package.json",
  "README.md",
  "OPEN_SOURCE_RELEASE.md",
  "docs/adoption-guide.md",
  "docs/loop-rules.md",
  "scripts/validate-kit.mjs",
  "templates/AGENTS-loop-contract.md",
  "templates/progress-loop-state.md",
  "templates/agent-team/start.md",
  "templates/agent-team/team.yaml",
  "templates/agent-team/prompts/coordinator.md",
  "templates/agent-team/prompts/docs.md",
  "templates/agent-team/prompts/domain-core.md",
  "templates/agent-team/prompts/provider.md",
  "templates/agent-team/prompts/asset.md",
  "templates/agent-team/prompts/billing.md",
  "templates/agent-team/prompts/admin-config.md",
  "templates/agent-team/prompts/qa.md",
  "skills/agent-loop-harness/SKILL.md",
  "tests/pressure-scenarios.md",
];

const skipDirs = new Set([".git", "node_modules"]);
const textFilePattern = /\.(md|mjs|js|json|txt|yml|yaml|sh|ps1|gitignore|gitattributes)$/i;
const issues = [];

function addIssue(file, line, type, message) {
  issues.push({ file, line, type, message });
}

function read(file) {
  return readFileSync(file, "utf8");
}

function lineOf(text, needle) {
  const index = text.indexOf(needle);
  if (index < 0) return 1;
  return text.slice(0, index).split(/\r?\n/).length;
}

function collectTextFiles(dir = ".") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const file = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTextFiles(file));
    } else if (textFilePattern.test(entry.name) || entry.name === "LICENSE") {
      files.push(file.replace(/\\/g, "/").replace(/^\.\//, ""));
    }
  }
  return files;
}

for (const file of requiredFiles) {
  if (!existsSync(file)) addIssue(file, 1, "missing_file", "Required file is missing.");
}

if (existsSync("package.json")) {
  const packageJson = JSON.parse(read("package.json"));
  if (packageJson.scripts?.test !== "node tests/validate-kit.mjs") {
    addIssue("package.json", 1, "package_script", "Missing expected test script.");
  }
  if (packageJson.scripts?.validate !== "node scripts/validate-kit.mjs") {
    addIssue("package.json", 1, "package_script", "Missing expected validate script.");
  }
}

const sensitivePatterns = [
  ["private_key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/i],
  ["aws_access_key", /AKIA[0-9A-Z]{16}/],
  ["github_token", /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["openai_key", /sk-[A-Za-z0-9_-]{20,}/],
  ["generic_secret", /(password|passwd|token|secret|api[_-]?key|access[_-]?key)\s*[:=]\s*['"]?[^'"\s]{8,}/i],
  ["email", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  ["phone_number", /(?:\+?86[- ]?)?1[3-9]\d{9}/],
  ["internal_host", /\b([a-z0-9-]+\.)+(corp|internal|lan|intra)\b/i],
  ["ipv4", /\b(?:\d{1,3}\.){3}\d{1,3}\b/],
  ["absolute_user_path", /[A-Za-z]:\\Users\\[^\\\s]+|\/Users\/[^/\s]+|\/home\/[^/\s]+/],
  ["specific_project_identifier", /\b[a-z]{2,}kk[-_][a-z0-9_-]+\b/i],
];

const textFiles = collectTextFiles();

for (const file of textFiles) {
  if (!existsSync(file)) continue;
  const lines = read(file).split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const [type, pattern] of sensitivePatterns) {
      if (type === "email" && line.includes("noreply@example.com")) continue;
      if (pattern.test(line)) {
        addIssue(file, index + 1, type, "Potentially sensitive pattern found; value suppressed.");
      }
    }
  });
}

if (existsSync("skills/agent-loop-harness/SKILL.md")) {
  const skill = read("skills/agent-loop-harness/SKILL.md");
  if (skill.includes("When applying this skill, return:")) {
    addIssue(
      "skills/agent-loop-harness/SKILL.md",
      lineOf(skill, "When applying this skill, return:"),
      "output_contract",
      "Skill should require file changes before final reporting.",
    );
  }
}

if (existsSync("templates/progress-loop-state.md")) {
  const progress = read("templates/progress-loop-state.md");
  if (!progress.includes("Status: not_started")) {
    addIssue(
      "templates/progress-loop-state.md",
      1,
      "ambiguous_status",
      "Progress template should use one status field instead of multiple checkboxes.",
    );
  }
}

if (existsSync("templates/AGENTS-loop-contract.md")) {
  const contract = read("templates/AGENTS-loop-contract.md");
  if (!contract.includes("any repeated attempt")) {
    addIssue(
      "templates/AGENTS-loop-contract.md",
      lineOf(contract, "- State:"),
      "state_gate",
      "State rule should cover repeated attempts and high-risk retries.",
    );
  }
  if (!contract.includes("PRD/spec confirmation flow")) {
    addIssue(
      "templates/AGENTS-loop-contract.md",
      1,
      "change_definition_gate",
      "Contract should include the staged PRD/spec confirmation gate.",
    );
  }
  if (!contract.includes("UTF-8")) {
    addIssue(
      "templates/AGENTS-loop-contract.md",
      1,
      "encoding_gate",
      "Contract should include explicit UTF-8 guidance for generated content.",
    );
  }
}

if (existsSync("templates/agent-team/team.yaml")) {
  const team = read("templates/agent-team/team.yaml");
  for (const required of ["coordinator-led", "domain_routing:", "ownership", "qa"]) {
    if (!team.includes(required)) {
      addIssue(
        "templates/agent-team/team.yaml",
        1,
        "agent_team_contract",
        `Agent team template should include ${required}.`,
      );
    }
  }
}

if (existsSync("templates/agent-team/start.md")) {
  const start = read("templates/agent-team/start.md");
  for (const required of ["fresh project-state scan", "non-overlapping file ownership", "Agent Task Template"]) {
    if (!start.includes(required)) {
      addIssue(
        "templates/agent-team/start.md",
        1,
        "agent_team_startup",
        `Agent team startup guide should include ${required}.`,
      );
    }
  }
}

for (const file of textFiles.filter((name) => name.startsWith("templates/agent-team/"))) {
  const text = read(file);
  const databaseMaterialPattern = new RegExp(
    [
      "data" + "base[-_\\s]?connection",
      "read-db" + "-config",
      "jd" + "bc:",
      "my" + "sql",
      "re" + "dis",
    ].join("|"),
    "i",
  );
  const forbidden = [
    ["database_connection_script", databaseMaterialPattern],
    ["project_specific_identifier", /\b[a-z]{2,}kk(?:[-_][a-z0-9_-]+)?\b/i],
  ];
  for (const [type, pattern] of forbidden) {
    if (pattern.test(text)) {
      addIssue(file, 1, type, "Agent team templates must stay generic and exclude database connection material.");
    }
  }
}

if (existsSync("skills/agent-loop-harness/SKILL.md")) {
  const skill = read("skills/agent-loop-harness/SKILL.md");
  if (!skill.includes("Requirement and Documentation Gates")) {
    addIssue(
      "skills/agent-loop-harness/SKILL.md",
      1,
      "requirement_gate",
      "Skill should describe when to add PRD/spec and documentation gates.",
    );
  }
  if (!skill.includes("Requirement gate:")) {
    addIssue(
      "skills/agent-loop-harness/SKILL.md",
      1,
      "completion_report",
      "Completion report should include requirement gate status.",
    );
  }
}

const gitLog = spawnSync("git", ["log", "--format=%H%x00%an%x00%ae"], {
  encoding: "utf8",
  stdio: "pipe",
});

if (gitLog.status === 0 && gitLog.stdout.trim()) {
  for (const row of gitLog.stdout.trim().split(/\r?\n/)) {
    const [hash, authorName, authorEmail] = row.split("\0");
    const commit = hash.slice(0, 12);
    if (authorName !== "Agent Loop Harness Kit Contributors") {
      addIssue(commit, 1, "git_author_name", "Git author name should use the generic release identity.");
    }
    if (authorEmail !== "noreply@example.com") {
      addIssue(commit, 1, "git_author_email", "Git author email should use the generic release identity.");
    }
  }
}

if (existsSync("README.md")) {
  const readme = read("README.md");
  if (!readme.includes("npm test")) {
    addIssue("README.md", 1, "verification_docs", "README should document the verification command.");
  }
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.file}:${issue.line} [${issue.type}] ${issue.message}`);
  }
  process.exit(1);
}

console.log(`Validated ${requiredFiles.length} required files and ${textFiles.length} text files.`);
