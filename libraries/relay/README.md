<p align="center">
  <a href="https://vocs.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/0xBuidlerHQ/relay/blob/main/.github/logo-dark.svg">
      <img alt="vocs logo" src="https://github.com/0xBuidlerHQ/relay/blob/main/.github/logo-light.svg" width="auto" height="200">
    </picture>
  </a>
</p>

# Relay

`Relay` is a lightweight helper for orchestrating sequential steps in React, where each step may depend on the previous one (APIs, blockchain calls, persistence, etc.). React components are event driven, which often makes it hard to reason about multi-step flows; Relay wraps each step in a typed store so you can control execution, retries, caching, and navigation without piling up `useEffect` chains.

## Documentation

[Head to the documentation](https://relay.0xbuidlerhq.com) to read and learn more about `Relay`.
