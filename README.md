<p align="center">
  <a href="https://relay.0xbuidlerhq.com">
    <picture>
      <img alt="Relay logo" src="https://github.com/0xbuidlerhq/relay/blob/main/.github/logo.svg" width="auto" height="200">
    </picture>
  </a>
</p>

# 🏃 Relay

Relay keeps multi-stage React flows deterministic by treating every async task as a typed step that the store coordinates.
Each step reports success or failure, the store exposes capability guards, and the helpers (`start`, `next`, `retry`, `resume`, `reset`) keep transitions safe even while the UI changes.

## Key ideas

- **Typed stepping:** `createRelay` locks in your config, metadata, success, and error payloads before you register any steps. `createRelayStep`, `StepSuccess`, and `StepError` keep every execution well-typed.
- **Guarded actions:** Derived flags such as `canStart`, `canNext`, `canRetry`, and `canResume` tell you exactly when to call each helper.
- **Configurable flow:** The default config runs the next step automatically (`autoNextExecute: true`) unless you opt into manually advancing with `executeOnNext: true`.
- **Centralized status:** `useRelay()` exposes `stepsState`, `stepsBase`, and `isRunning` so your UI can render loaders, retries, and confirmations without scattering `useEffect` hooks.

## Quick start

1. Define your DTOs (`RelayConfig`, `RelayStepBase`, `RelayStepSuccess`, `RelayStepError`).
2. Call `createRelay("flow-key", config)` to lock in your types and optional config overrides.
3. Build steps with `createRelayStep`, pass them to `initialize`, and drive the flow with `start`, `next`, `retry`, `resume`, or `reset`.
4. Use `stepsState` + `stepsBase` plus the guard booleans from `useRelay()` to build status updates and navigation controls.

Read the full guide at [relay.0xhq.com/docs/getting-started](https://relay.0xhq.com/docs/getting-started) and see `apps/docs.relay/examples/simple` for a working UI.

## Install

```bash
pnpm add @0xhq/relay
```

Works in TypeScript-friendly toolchains that understand ESM entry points (Node 18+, Next.js, Vite, Deno, etc.).
