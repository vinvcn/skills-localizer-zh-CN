# Translation Policy Schema

Target translated repositories should define a policy file at:

```text
.skill-localization/policy.json
```

The `maintain-translated-skills` skill and validator use this file to separate portable localization behavior from repo-specific rules.

## Fields

### `upstreamRepo`

Source skill repository, formatted as `owner/repo`.

Use it as a content source identifier only. Do not treat it as a Git fork-sync target.

### `localizedRepo`

Translated repository install path, formatted as `owner/repo`.

Installation examples and user-facing setup commands should point here, not at `upstreamRepo`.

### `locale`

Target locale tag, such as `zh-CN`, `ja-JP`, `ko-KR`, or `es-ES`.

### `publicBuckets`

Array of bucket directories whose skills must appear in public indexes and manifests.

Example:

```json
[
  "skills/engineering",
  "skills/productivity",
  "skills/misc"
]
```

### `privateBuckets`

Array of bucket directories whose skills must not appear in public indexes or manifests.

Typical examples include in-progress, personal, deprecated, experimental, or internal-only buckets.

### `manifestPaths`

Array of JSON manifests or registry files that list public skills.

The validator currently supports JSON manifests containing either:

- a top-level `skills` array of paths
- nested JSON text where skill paths can be searched as strings

### `indexPaths`

Array of Markdown index files that should list the correct public skills.

Usually this includes the top-level `README.md` plus each public bucket `README.md`.

### `protectedPatterns`

Array of literal strings or JavaScript regex strings that should remain visible after localization.

Use this for repository-specific commands, setup slash commands, install paths, tool names, labels, or identifiers that are easy to mistranslate.

Regex strings should be written with leading and trailing slash delimiters:

```json
[
  "/^name:\\s*[a-z0-9-]+$/m"
]
```

Plain strings are matched literally.

### `validationCommands`

Array of repo-local commands maintainers should run after a refresh.

The portable validator prints these commands for the agent to run. It does not execute them.

## Minimal Example

```json
{
  "upstreamRepo": "owner/source-skills",
  "localizedRepo": "owner/source-skills-locale",
  "locale": "zh-CN",
  "publicBuckets": ["skills/engineering", "skills/productivity"],
  "privateBuckets": ["skills/in-progress", "skills/personal", "skills/deprecated"],
  "manifestPaths": [".claude-plugin/plugin.json"],
  "indexPaths": ["README.md", "skills/engineering/README.md", "skills/productivity/README.md"],
  "protectedPatterns": ["npx skills@latest add owner/source-skills-locale"],
  "validationCommands": ["git diff --check"]
}
```
