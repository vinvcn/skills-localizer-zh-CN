# Localized Skill Repo README Pattern

Use this reference when creating or rewriting the top-level README for a translated skill repository.

This pattern is extracted from a real Simplified Chinese localized skill repo, but the rules below are portable. Replace all names, commands, repo paths, badges, and skill examples with values from the target repo policy.

## Goal

The README should be a user entry point in the target language, not just a translation note.

首屏应是目标语言用户入口，而不是“翻译说明”。

The first screen should answer:

1. What is this repo?
2. What problem does it solve?
3. How do I install it?
4. What should I do immediately after installation?

首屏要回答：我是谁、解决什么问题、怎么安装、装完马上能干什么。

## Recommended Structure

~~~markdown
# <Localized project name>

<One-sentence positioning for target-language users.>

<Short contrast or promise that makes the repo useful in practice.>

- <Core workflow or scenario 1>: [`/<skill-name>`](./path/to/SKILL.md)
- <Core workflow or scenario 2>: [`/<skill-name>`](./path/to/SKILL.md)
- <Core workflow or scenario 3>: [`/<skill-name>`](./path/to/SKILL.md)

## <Short install heading>

```bash
npx skills@latest add <localizedRepo>
```

<Tell users what to select and what slash command or skill to run first.>

<Optional badge row or compact reference links.>

## About this localized edition

<Upstream attribution with link. Explain that natural-language prose is localized while behavior-critical identifiers are preserved.>

<Explain why the target-language edition is useful for readers and target-language agent interactions.>

<Link to the repo's localization policy or maintainer skill.>

## Release and validation

<Concise sync log and checklist. Do not paste full command output.>

## Original README translation

<Optional translated upstream README content, if useful. Keep the localized user entry above it.>
~~~

## First-Screen Rules

- Put the localized project name in the H1.
- Use target-language positioning before maintainer notes.
- Show 3-6 concrete use cases or representative skills before long background text.
- Keep the localized install command prominent and unchanged from `policy.localizedRepo`.
- Tell users the immediate next command or skill to run after installation.
- Keep upstream attribution visible, but do not lead with translation mechanics.

## Skill Links

Every referenced skill name should link to its `SKILL.md`.

Prefer links that survive GitHub rendering:

```markdown
[`/skill-name`](./skills/<bucket>/<skill-name>/SKILL.md)
```

For a reference section, use concise entries:

```markdown
- **[skill-name](./skills/<bucket>/<skill-name>/SKILL.md)** - <one-line localized description>.
```

## Badge And Reference Links

If the target repo has a public skills registry page, use a compact badge or badge-like row near the install section.

Use public badge URLs or simple link chips. Do not copy private site assets into the repo.

Good link targets include:

- localized registry page
- upstream registry page
- installer or registry docs
- upstream community/newsletter page, when relevant

## Localization Notes

Keep these notes after the install/user-entry section:

- upstream repo attribution
- content localization strategy
- behavior-critical preservation rule
- localized install path rule
- link to policy file or maintainer skill

Do not describe the repo as only a translation if it should function as the target-language user's main entry point.

## Sync And Validation Notes

Keep release records short:

```markdown
- YYYY-MM-DD: Synced upstream `<upstreamRepo>@<short-sha>`, local commit `<short-sha>`. <One sentence about visible content change.>
```

Validation checklists should summarize pass/fail state:

```markdown
- [x] Portable localization validator passed.
- [x] Public skill indexes match configured public buckets.
- [x] Install commands point to `<localizedRepo>`.
- [!] English audit still contains protected identifiers and technical terms; reviewed as non-blocking.
```

Do not paste full command output into the README.

## Anti-Patterns

- Starting with a long explanation of translation process.
- Burying installation below release logs.
- Translating slash commands, paths, package names, code, or frontmatter `name`.
- Pointing install commands at the upstream repo.
- Mixing upstream repo-management state into the localized repo.
- Promoting private, personal, deprecated, or in-progress skills in public indexes.
