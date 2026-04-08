<p align="center">
  <a href="https://vocs.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/0xbuidlerhq/relay/blob/main/.github/logo.svg">
      <img alt="Relay logo" src="https://github.com/0xbuidlerhq/relay/blob/main/.github/logo.svg" width="auto" height="200">
    </picture>
  </a>
</p>

# 🏃 Relay

Relay is a tiny, focused helper for orchestrating sequential async flows inside React. Each "step" is a typed function that runs once, can report success or failure, and automatically updates a centralized Zustand store. Relay then exposes helpers to:

- Execute/retry individual steps (`start`, `next`, etc.)
- Guard state transitions (`canStart`, `canNext`, etc.)
- Reset without letting stale promises overwrite the next run

This makes Relay ideal for multi-stage flows (blockchain transactions, onboarding UIs, setup wizards) where you want deterministic execution, retry points, and state that stays consistent even if users reset the flow mid-flight.

## Key Concepts

1. **Steps** – small async tasks registered via `RelayStepBase`. Each receives a relay-controlled `AbortSignal`, letting it stop early when the flow resets or restarts.
2. **State Store** – Zustand tracks the array of step states plus derived capabilities. Components simply consume `useRelay()` to drive the UI without managing `useEffect` chains.
3. **Control Actions** – `start`, `next`, `retry`, `reset`, etc., update the store and automatically enforce guards so you never run steps out of order or while another run is in progress.

## Installation

```bash
pnpm add @0xhqy
```

## Learn More

Browse the docs and examples at [https://relay.0xhq.com](https://relay.0xhq.com)
