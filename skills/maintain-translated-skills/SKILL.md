---
name: maintain-translated-skills
description: Use this skill to create, refresh, review, and validate translated versions of skill repositories. It preserves behavior-critical identifiers while localizing natural-language prose, keeps public skill indexes and manifests in sync, and uses a target-repo policy file to avoid source-repo-specific assumptions.
---

# Maintain Translated Skills

Use this skill when maintaining a localized version of a skill repository.

使用本 skill 维护 skill 仓库的本地化版本。

This skill is for **content localization**, not Git fork synchronization.

本 skill 面向**内容本地化**，不是 Git fork 同步。

## Core Rule

Translate natural-language prose. Preserve behavior-critical content exactly.

翻译自然语言说明；行为关键内容必须原样保留。

Preserve:

- directory names and skill folder names
- slash commands and CLI commands
- code blocks and inline code
- file paths, URLs, package names, tool names, API identifiers, and env vars
- YAML, JSON, TOML, and frontmatter keys
- `SKILL.md` frontmatter `name` values
- labels, issue states, or terms that the target repo policy marks as protected

保留目录名、skill 名、命令、代码、路径、URL、包名、工具/API/env 标识、结构化配置 key、frontmatter `name`，以及 policy 中声明的保护词。

When unsure whether a span affects behavior, preserve it and flag it for review.

不确定是否影响行为时，原样保留并标记给维护者复核。

## Required Target Policy

Before changing a translated repo, find its policy file:

```text
.skill-localization/policy.json
```

If it does not exist, create or ask for one before a broad refresh. For narrow one-file edits, infer cautiously and recommend adding the policy afterward.

变更前先读取 `.skill-localization/policy.json`。大范围刷新不能缺少 policy；窄范围单文件修改可以谨慎推断，但应建议补上 policy。

Read `references/policy-schema.md` from this skill repo when you need field details.

需要字段细节时读取本 skill 仓库的 `references/policy-schema.md`。

Read `references/localized-readme-pattern.md` before creating or rewriting a target repo README.

创建或重写目标仓库 README 前，先读取 `references/localized-readme-pattern.md`。

## Workflow: Initial Localization Setup

1. Inspect the source repo and target repo shape.
2. Create `.skill-localization/policy.json` in the target repo.
3. Set `upstreamRepo`, `localizedRepo`, `locale`, public/private buckets, manifests, index files, protected patterns, and validation commands.
4. Translate prose-bearing files.
5. Keep executable support files only when they are needed by the translated repo.
6. Update README and bucket indexes to describe the localized repo as a real user entry, not as translation notes only.
7. Run the portable validator and target repo validation commands.

初始本地化：先建立 policy，再翻译 prose-bearing files，保留必要执行文件，更新公开索引，最后验证。

## Workflow: Upstream Content Refresh

1. Treat upstream as a content source, not as repository-management authority.
2. Compare source and target content files to identify new, changed, and removed items.
3. Translate new and changed natural-language prose.
4. Preserve protected spans from the target policy.
5. Keep localized install commands pointed at `localizedRepo`.
6. Do not import upstream issue labels, release state, CI policy, branch policy, or maintainer metadata unless the target policy explicitly asks for it.
7. Update public indexes and manifests according to `publicBuckets`, `privateBuckets`, `indexPaths`, and `manifestPaths`.
8. Record a concise sync note in the target README when that repo uses one.
9. Run validation and report review flags.

上游刷新：把 upstream 当内容来源，不导入上游仓库治理状态；根据 policy 同步公开索引和 manifest。

## Workflow: Index And Manifest Maintenance

Public skills are the skills under `publicBuckets`.

公开 skills 由 `publicBuckets` 决定。

For each public skill:

- it should appear in configured public indexes
- it should appear in configured manifests
- README entries should link the skill name to its `SKILL.md`

每个公开 skill 都应出现在公开索引和 manifest 中，README 条目要链接到对应 `SKILL.md`。

For each private skill:

- it must not appear in public indexes
- it must not appear in public manifests
- it may still have a bucket README if the target repo intentionally documents private/internal content

私有、草稿、弃用或个人 skills 不应进入公开索引和公开 manifest。

## Workflow: Review And Release

Run the portable validator:

```bash
node /path/to/skills-localizer-zh-CN/scripts/validate-translated-skills.mjs --root /path/to/translated-repo
```

Then run the target repo's `validationCommands`.

先运行 portable validator，再运行目标仓库 policy 中的验证命令。

Final report should include:

- changed files
- translated files
- copied or preserved files
- removed or stale files
- index and manifest changes
- validation results
- review flags
- invariant checks for install paths, code blocks, frontmatter, paths, identifiers, and Markdown structure

最终报告要列出改动、翻译、保留/复制、删除/stale、索引/manifest、验证结果、复核标记和关键 invariant。

## Output Discipline

Do not paste full command output into README files.

不要把完整命令输出粘进 README。

When rewriting README files, make the first viewport useful to target-language users: identity, problem solved, install command, and immediate next action. Keep translation strategy, sync logs, and validation notes secondary.

重写 README 时，首屏先服务目标语言用户：我是谁、解决什么问题、怎么安装、装完马上做什么。翻译策略、同步记录和验证说明放到后面。

Keep maintainer-facing sync notes concise.

维护记录保持简短。

Prefer small, reviewable patches. Do not bundle unrelated repo-management changes into a localization refresh.

优先小而可审的 patch，不把无关仓库治理改动混进本地化刷新。
