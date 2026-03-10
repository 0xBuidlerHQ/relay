import { relay } from "./relay";

type DefaultActionStepBase = { type: string; label: string };
type DefaultActionStepSuccess = { link: string };
type DefaultActionStepError = { msg: string };

// We'll store instances keyed by a unique identifier
const stepperInstances = new Map<string, unknown>();
const DEFAULT_INSTANCE_KEY = "default";

/**
 * Creates a stepper instance with the specified generic types.
 * Consumers can call this to get a customized stepper with their own types.
 * If the same key is used multiple times, returns the existing instance (singleton per key).
 */
function createRelay<
	TBase extends {} = DefaultActionStepBase,
	TSuccess extends {} = DefaultActionStepSuccess,
	TError extends {} = DefaultActionStepError,
>(instanceKey: string = DEFAULT_INSTANCE_KEY) {
	if (!stepperInstances.has(instanceKey)) {
		stepperInstances.set(instanceKey, relay<TBase, TSuccess, TError>());
	}

	return stepperInstances.get(instanceKey) as {
		useRelay: ReturnType<typeof relay<TBase, TSuccess, TError>>["useRelay"];
		createRelayStep: ReturnType<typeof relay<TBase, TSuccess, TError>>["createRelayStep"];
		StepSuccess: ReturnType<typeof relay<TBase, TSuccess, TError>>["StepSuccess"];
		StepError: ReturnType<typeof relay<TBase, TSuccess, TError>>["StepError"];
	};
}

export { createRelay };
