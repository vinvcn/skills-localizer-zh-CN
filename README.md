# Skills Localizer zh-CN

Tell an agent to translate and maintain a localized skills repo. The human should not need to hand-edit policy files, indexes, manifests, or README sections.

This repo gives the agent one reusable skill:

- [`maintain-translated-skills`](./skills/maintain-translated-skills/SKILL.md)

The skill teaches the agent how to localize natural-language prose while preserving commands, paths, frontmatter, package names, tool identifiers, code blocks, install paths, and public skill indexes.

## Install

Install this skills repo into your coding agent:

```bash
npx skills@latest add vinvcn/skills-localizer-zh-CN
```

Then work in the translated skills repo you want to create or maintain.

## What To Ask The Agent

For a new translated skills repo:

```text
Use /maintain-translated-skills.

Create and maintain a translated skills repo from <upstream-owner>/<upstream-repo> into <localized-owner>/<localized-repo>.

Target language: <locale>.

Create any needed localization policy, translate the user-facing skill content, keep behavior-critical identifiers unchanged, update README/index/manifest files, run validation, and tell me what changed.
```

For an existing translated skills repo:

```text
Use /maintain-translated-skills.

Sync this translated skills repo with the latest relevant upstream content.

Do not treat upstream as a Git fork-sync target. Translate prose only, preserve behavior-critical identifiers, update public skill indexes and manifests, refresh the README as a human-facing localized entry point, run validation, and report review flags.
```

The agent should create or update `.skill-localization/policy.json` when the target repo needs one. You should not need to manually edit it first.

## What The Agent Will Do

- Inspect the upstream and translated repo structure.
- Create or update the target repo policy.
- Translate natural-language prose.
- Preserve behavior-critical content exactly.
- Keep install commands pointed at the localized repo.
- Keep public skills in README/index/manifest files.
- Keep private, personal, deprecated, or in-progress skills out of public indexes.
- Rewrite the README as a user-facing localized entry point when needed.
- Run the portable validator and any target repo validation commands.
- Report changed files, validation results, and review flags.

## What This Repo Contains

- [`skills/maintain-translated-skills/SKILL.md`](./skills/maintain-translated-skills/SKILL.md) - the agent workflow.
- [`references/policy-schema.md`](./references/policy-schema.md) - the policy shape the agent uses in target repos.
- [`references/localized-readme-pattern.md`](./references/localized-readme-pattern.md) - the README pattern the agent should apply.
- [`scripts/validate-translated-skills.mjs`](./scripts/validate-translated-skills.mjs) - portable checks for translated skill repos.
- [`examples/translation-policy.json`](./examples/translation-policy.json) - an example policy the agent can adapt.

## Manual Validator

The agent should run this for you, but you can also run it directly:

```bash
node /path/to/skills-localizer-zh-CN/scripts/validate-translated-skills.mjs --root /path/to/translated-skills-repo
```

The validator prints errors and review flags. It does not edit files.
