# Relay

<p align="center">
  <a href="https://vocs.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/0xBuidlerHQ/relay/blob/main/.vscode/logo-dark.svg">
      <img alt="vocs logo" src="https://github.com/0xBuidlerHQ/relay/blob/main/.vscode/logo-light.svg" width="auto" height="40">
    </picture>
  </a>
</p>

> Relay turns messy async flows into clean, typed step-by-step state machines your UI can control.

`Relay` is a lightweight helper for orchestrating sequential steps in React, where each step may depend on the previous one (APIs, blockchain calls, persistence, etc.). React components are event driven, which often makes it hard to reason about multi-step flows; Relay wraps each step in a typed store so you can control execution, retries, caching, and navigation without piling up `useEffect` chains.

## Features

- Typed step definitions with success/error payload helpers.
- Zustand-powered store that exposes `useRelay`, `start`, `next`, `retry`, and state selectors.
- Built-in status tracking (`idle`, `loading`, `success`, `error`, `disabled`) for each step.
- Singleton instances per key when you need multiple flows in the same app.

## Installation

```sh
pnpm add @0xbuidlerhq/relay
```

Relay is ESM first, so ensure your project supports `type: "module"` or use a bundler that understands `.ts`/`.mjs` outputs.

## Overview

```ts
import { createRelay, StepSuccess, StepError } from "@0xbuidlerhq/relay";

const { useRelay, createRelayStep } = createRelay();

const steps = [
  createRelayStep({
    id: "fetch-user",
    fn: async () => fetch("/api/me").then((r) => r.json()),
  }),
  createRelayStep({
    id: "create-session",
    fn: async () => StepSuccess({ sessionId: crypto.randomUUID() }),
  }),
];

function Flow() {
  const relay = useRelay();

  return (
    <button onClick={() => relay.initialize(steps)}>
      {relay.isRunning ? "Running" : "Start flow"}
    </button>
  );
}
```

## Documentation

[Head to the documentation](https://google.com) to read and learn more about `Relay`.
