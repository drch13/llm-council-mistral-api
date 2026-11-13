# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [1.1.1] - 2026-11-13

### Bug fixes

- Persist assistant message metadata (aggregate rankings) in storage


### Other

- Merge pull request #5 from drch13/vibe/persist-stage-metadata-145aa9

fix: persist assistant message metadata (aggregate rankings) in storage

## [1.1.0] - 2026-11-12

### Bug fixes

- Strip leading v from git-cliff bumped version so exe is named LLM-Council-vX.Y.Z.exe


### Features

- Add button to download stage 3 final answer as a Markdown file


### Other

- Merge pull request #4 from drch13/vibe/stage3-md-download-exe-version-4dc4f0

feat: download stage 3 answer as Markdown + fix exe version naming (vvX.Y.Z)

## [1.0.1] - 2026-11-11

### Bug fixes

- Make cliff.toml templates compatible with git-cliff 2.14 (drop short filter and footer)


### CI

- Name release exe after version tag (LLM-Council-vX.Y.Z.exe)

- Install git-cliff via npm instead of GitHub release tarball (URL 404s)


### Documentation

- Add Keep a Changelog for v1.0.0, Conventional Commits rule and release pipeline


### Other

- Auto-create GitHub release with the .exe on tags v*

- Revert "CI: auto-create GitHub release with the .exe on tags v*"

This reverts commit 164140a07390facaab7ba7ac68dbefda1cdb5aa0.

- Update README to clarify project purpose and remove sections

Removed image reference and a section about the project's vibe coding. Clarified the project's purpose and functionality.

- Fix Markdown table rendering by enabling remark-gfm in all ReactMarkdown components

react-markdown v10 only supports CommonMark by default, so GFM tables
were displayed as raw pipe-separated text. Add remark-gfm and pass it
via remarkPlugins in Stage1, Stage2, Stage3 and ChatInterface, plus
table styling in index.css.

Co-authored-by: drch13 <drch13@users.noreply.github.com>

- Merge pull request #2 from drch13/vibe/gfm-markdown-tables-3ac28b

Fix Markdown table rendering (enable remark-gfm)

- Merge pull request #3 from drch13/vibe/fix-git-cliff-install-3ac28b

Fix release.yml: install git-cliff via npm (GitHub tarball URL 404s)


## [Unreleased]

## [1.0.0] - 2026-11-03

### Added
- Fork of Andrej Karpathy's LLM Council adapted to the Mistral API (La Plateforme) instead of OpenRouter
- 3-stage council flow: parallel first opinions, anonymized peer review and ranking, chairman synthesis
- Settings UI (gear icon) to enter and validate the `MISTRAL_API_KEY` and to pick the interface language; the key is stored in the local `.env` (next to the `.exe` in packaged mode)
- CI build of the Windows `LLM-Council.exe` artifact on every push to `master`
- 9-language support for the UI and the Stage 2/3 prompts (EN, FR, IT, DE, ES, PT, SV, NO, EL), prompt templates in `backend/prompts/`
- End-to-end API error classification documented in `docs/errors_message.md`

### Fixed
- DeepSeek model identifier (`deepseek-v4-1-flash-1017`)
- Data directory anchored next to the `.exe` in packaged mode

### Changed
- README updated to document the Mistral fork, setup, model configuration and packaged executable

[1.0.0]: https://github.com/drch13/llm-council-mistral-api/releases/tag/v1.0.0
