# Skills Localizer zh-CN

Reusable agent skill and validation scripts for maintaining translated versions of skill repositories.

This repo is for **content localization**, not Git fork synchronization. It helps an agent translate natural-language prose while preserving behavior-critical identifiers, commands, paths, frontmatter, manifests, and public skill indexes.

## Contents

- [`skills/maintain-translated-skills/SKILL.md`](./skills/maintain-translated-skills/SKILL.md) - bilingual maintainer skill.
- [`scripts/validate-translated-skills.mjs`](./scripts/validate-translated-skills.mjs) - portable validation checks for translated skill repos.
- [`references/policy-schema.md`](./references/policy-schema.md) - target repo policy schema.
- [`examples/translation-policy.json`](./examples/translation-policy.json) - generic starter policy.

## Target Repo Setup

In each translated skill repo, add:

```text
.skill-localization/policy.json
```

Start from [`examples/translation-policy.json`](./examples/translation-policy.json), then set the upstream repo, localized repo path, public/private buckets, index files, manifests, protected patterns, and repo-local validation commands.

## Validation

Run the validator from this repo against a translated skill repo:

```bash
node scripts/validate-translated-skills.mjs --root /path/to/translated-skill-repo
```

Or from inside a translated skill repo:

```bash
node /path/to/skills-localizer-zh-CN/scripts/validate-translated-skills.mjs
```

The validator reports errors and review flags. It does not edit files.
