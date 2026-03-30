## Contributing to Relay

Thanks for wanting to help make `Relay` better! Here is how to get started:

1. **Discuss before major changes.** Open an issue describing the proposal or problem so maintainers can weigh in on direction and requirements.
2. **Keep the repo tidy.** Follow existing coding styles, especially for TypeScript/React code. Run `pnpm lint`/`pnpm test` for your area of change.
3. **Write tests for new behavior.** Relay relies on a focused test suite (`libraries/relay/tests`). Add or update tests that demonstrate both the success and failure paths of any new logic.
4. **Document your changes.** Update docs and examples in `apps/docs.relay` whenever you add or clarify features.
5. **Describe your PR.** Link related issues, summarize behavior, and list how you validated it (tests, manual steps, etc.).

## Reporting Issues

Use GitHub Issues to report bugs or request enhancements. Provide reproduction steps, relevant logs, and the environment where you observed the problem.

## Branches and Releases

- Keep work on topic branches named after the change (e.g., `fix/reset-guard`).
- Do not push to `main` directly; open a pull request targeting `main` when the change is ready.
