#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const root = path.resolve(args.root || process.cwd());
const policyPath = path.resolve(
  root,
  args.policy || ".skill-localization/policy.json",
);

const errors = [];
const flags = [];

function error(file, message) {
  errors.push({ file, message });
}

function flag(file, message) {
  flags.push({ file, message });
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--root") {
      parsed.root = rawArgs[index + 1];
      index += 1;
    } else if (arg.startsWith("--root=")) {
      parsed.root = arg.slice("--root=".length);
    } else if (arg === "--policy") {
      parsed.policy = rawArgs[index + 1];
      index += 1;
    } else if (arg.startsWith("--policy=")) {
      parsed.policy = arg.slice("--policy=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function printHelp() {
  console.log(`Usage:
  node scripts/validate-translated-skills.mjs [--root <repo>] [--policy <path>]

Defaults:
  --root    current working directory
  --policy  .skill-localization/policy.json, relative to --root
`);
}

function loadPolicy() {
  if (!fs.existsSync(policyPath)) {
    error(
      relative(policyPath),
      "missing policy file; expected .skill-localization/policy.json",
    );
    return {};
  }

  try {
    return JSON.parse(readText(policyPath));
  } catch (cause) {
    error(relative(policyPath), `invalid JSON policy: ${cause.message}`);
    return {};
  }
}

function trackedFiles() {
  try {
    const output = execFileSync("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (output) return output.split("\n").filter(Boolean);
  } catch {
    flag(".", "git ls-files failed; falling back to filesystem walk");
  }

  const results = [];
  walk(root, results);
  return results.map(relative).sort();
}

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === ".git" ||
      entry.name === "node_modules" ||
      entry.name === "dist"
    ) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeDir(dir) {
  return String(dir).replace(/\/+$/, "");
}

function isUnder(file, dir) {
  const normalized = normalizeDir(dir);
  return file === normalized || file.startsWith(`${normalized}/`);
}

function pathToSkillDir(skillMd) {
  return skillMd.replace(/\/SKILL\.md$/, "");
}

function allSkillsInBuckets(files, buckets) {
  return files
    .filter((file) => file.endsWith("/SKILL.md"))
    .filter((file) => buckets.some((bucket) => isUnder(file, bucket)))
    .map(pathToSkillDir)
    .sort();
}

function checkMarkdown(files) {
  for (const file of files.filter((item) => item.endsWith(".md"))) {
    const text = readText(path.join(root, file));
    const fences = text.match(/```/g) || [];
    if (fences.length % 2 !== 0) {
      error(file, "unbalanced fenced code blocks");
    }
  }
}

function checkSkillFrontmatter(files) {
  for (const file of files.filter((item) => item.endsWith("/SKILL.md"))) {
    const text = readText(path.join(root, file));
    const frontmatterMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      error(file, "missing or malformed YAML frontmatter");
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter
      .match(/^description:\s*(.+)$/m)?.[1]
      ?.trim();

    if (!name) {
      error(file, "missing frontmatter name");
    } else if (!/^[a-z0-9-]+$/.test(name)) {
      error(file, "frontmatter name must remain an ASCII slug");
    }

    if (!description) {
      error(file, "missing frontmatter description");
    } else if (description.length > 1024) {
      error(file, "frontmatter description exceeds 1024 characters");
    }
  }
}

function checkInstallPaths(files, policy) {
  const upstreamRepo = policy.upstreamRepo;
  const localizedRepo = policy.localizedRepo;

  if (!upstreamRepo || !localizedRepo) {
    flag(
      relative(policyPath),
      "upstreamRepo/localizedRepo missing; install path checks skipped",
    );
    return;
  }

  let sawLocalizedInstall = false;
  const installCommandPattern = /skills@latest\s+add\s+(\S+)/;

  for (const file of files.filter((item) => item.endsWith(".md"))) {
    const lines = readText(path.join(root, file)).split(/\r?\n/);
    lines.forEach((line, index) => {
      const match = line.match(installCommandPattern);
      if (!match) return;
      const repo = match[1];
      if (repo.includes(upstreamRepo)) {
        error(
          `${file}:${index + 1}`,
          `install command points at upstreamRepo (${upstreamRepo})`,
        );
      }
      if (repo.includes(localizedRepo)) {
        sawLocalizedInstall = true;
      }
    });
  }

  if (!sawLocalizedInstall) {
    flag(
      ".",
      `no localized install command found for ${localizedRepo}; verify this is intentional`,
    );
  }
}

function compileProtectedPattern(pattern) {
  if (
    typeof pattern === "string" &&
    pattern.startsWith("/") &&
    pattern.lastIndexOf("/") > 0
  ) {
    const lastSlash = pattern.lastIndexOf("/");
    const body = pattern.slice(1, lastSlash);
    const flagsText = pattern.slice(lastSlash + 1);
    return new RegExp(body, flagsText);
  }
  return String(pattern);
}

function checkProtectedPatterns(files, policy) {
  const patterns = asArray(policy.protectedPatterns).map(compileProtectedPattern);
  if (!patterns.length) return;

  const searchableText = files
    .filter((file) => /\.(md|json|ya?ml|toml|txt)$/.test(file))
    .map((file) => readText(path.join(root, file)))
    .join("\n");

  for (const pattern of patterns) {
    const matched =
      pattern instanceof RegExp
        ? pattern.test(searchableText)
        : searchableText.includes(pattern);
    if (!matched) {
      flag(
        relative(policyPath),
        `protected pattern was not found in repo content: ${pattern.toString()}`,
      );
    }
  }
}

function checkIndexes(files, policy) {
  const publicSkills = allSkillsInBuckets(files, asArray(policy.publicBuckets));
  const privateSkills = allSkillsInBuckets(files, asArray(policy.privateBuckets));
  const indexPaths = asArray(policy.indexPaths);
  const manifestPaths = asArray(policy.manifestPaths);

  if (!publicSkills.length) {
    flag(relative(policyPath), "no public skills found from publicBuckets");
  }

  for (const indexPath of indexPaths) {
    if (!fs.existsSync(path.join(root, indexPath))) {
      error(indexPath, "configured indexPath does not exist");
      continue;
    }
    const text = readText(path.join(root, indexPath));
    const isTopLevelIndex = !indexPath.startsWith("skills/");
    const indexDir = path.dirname(indexPath) === "." ? "" : path.dirname(indexPath);

    for (const skill of publicSkills) {
      if (!isTopLevelIndex && !isUnder(skill, indexDir)) continue;
      const name = path.basename(skill);
      if (!text.includes(`${name}`) || !text.includes("SKILL.md")) {
        error(indexPath, `missing public skill entry or SKILL.md link: ${skill}`);
      }
    }

    for (const skill of privateSkills) {
      const name = path.basename(skill);
      if (text.includes(skill) || text.includes(`/${name}/SKILL.md`)) {
        error(indexPath, `private skill appears in public index: ${skill}`);
      }
    }
  }

  for (const manifestPath of manifestPaths) {
    if (!fs.existsSync(path.join(root, manifestPath))) {
      error(manifestPath, "configured manifestPath does not exist");
      continue;
    }

    const text = readText(path.join(root, manifestPath));
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      flag(manifestPath, "manifest is not JSON; using string-based checks");
    }

    const manifestText = parsed ? JSON.stringify(parsed) : text;

    for (const skill of publicSkills) {
      if (!manifestText.includes(skill)) {
        error(manifestPath, `missing public skill: ${skill}`);
      }
    }

    for (const skill of privateSkills) {
      if (manifestText.includes(skill)) {
        error(manifestPath, `private skill appears in manifest: ${skill}`);
      }
    }
  }
}

function report(policy) {
  for (const item of errors) {
    console.error(`ERROR ${item.file}: ${item.message}`);
  }
  for (const item of flags) {
    console.warn(`FLAG ${item.file}: ${item.message}`);
  }

  const commands = asArray(policy.validationCommands);
  if (commands.length) {
    console.log("\nRepo-local validation commands to run:");
    for (const command of commands) {
      console.log(`- ${command}`);
    }
  }

  if (errors.length) {
    console.error(`\nValidation failed: ${errors.length} error(s), ${flags.length} flag(s).`);
    process.exit(1);
  }

  console.log(`Validation passed: 0 errors, ${flags.length} flag(s).`);
}

const policy = loadPolicy();
const files = trackedFiles();

checkMarkdown(files);
checkSkillFrontmatter(files);
checkInstallPaths(files, policy);
checkProtectedPatterns(files, policy);
checkIndexes(files, policy);
report(policy);
