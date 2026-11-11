# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
