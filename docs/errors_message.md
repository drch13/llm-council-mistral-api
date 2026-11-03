# Error messages displayed to the user

The backend classifies every failure of a call to the Mistral API
(`backend/mistral.py: classify_error()`) into a `type` + human-readable
`message`. The rules below describe when each message is shown.

## Behavior rules

- **No problem** → no error message is displayed at all (`error: null`).
- **One of the non-chairman council models fails** (global Mistral outage, or
  one specific model endpoint down) → the council discussion is **not**
  blocked: the remaining models still answer and rank. A small warning box is
  displayed **under the final answer (Stage 3)** listing each unavailable
  model and its error type.
- **The chairman fails** → the generic message
  "Error: Unable to generate final synthesis." is replaced by a precise
  message containing the actual error type and cause.
- **All models fail** → "All models failed to respond." followed by the type
  and message of the first error.

## Error types

| Type | Detection | Message shown to the user |
|---|---|---|
| `missing_api_key` | no key configured | "No Mistral API key configured. Add it via Settings." |
| `invalid_api_key` | HTTP 401 / 403 from Mistral | "Invalid or missing Mistral API key (HTTP xxx). Update it via Settings." |
| `model_unavailable` | HTTP 404 (model id wrong or retired) | "Model not found on the Mistral API (HTTP 404) — the model id may be wrong or retired." |
| `rate_limited` | HTTP 429 | "Mistral API rate limit or quota exceeded (HTTP 429)." |
| `mistral_server_error` | HTTP 5xx | "Mistral API server error (HTTP xxx)." |
| `http_error` | any other HTTP status | "Mistral API error (HTTP xxx)." |
| `network_error` | timeout / connection error | "Cannot reach the Mistral API — check your internet connection." |
| `unknown_error` | anything else | the raw exception message |

## Where it is displayed

- **Stage 3 (final answer)**: warning box under the chairman's response,
  listing `model — [error type] message` for every council model that failed
  during Stage 1 or Stage 2 (`metadata.model_errors`, also sent through the
  SSE stream).
- **Chairman failure**: the error is embedded directly in the final answer
  text, e.g. `Error: Unable to generate final synthesis. [rate_limited]
  Mistral API rate limit or quota exceeded (HTTP 429).`
- **Server console**: every failure is also printed server-side with its
  type (`Error querying model <model>: [<type>] <message>`).
