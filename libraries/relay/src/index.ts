import { type RelayConfig, relay } from "./relay";

type DefaultConfig = RelayConfig;
type DefaultActionStepBase = {};
type DefaultActionStepSuccess = {};
type DefaultActionStepError = {};

// We'll store instances keyed by a unique identifier
const stepperInstances = new Map<string, unknown>();
const DEFAULT_INSTANCE_KEY = "DEFAULT_RELAY_KEY";

/**
 * Creates a stepper instance with the specified generic types.
 * Consumers can call this to get a customized stepper with their own types.
 * If the same key is used multiple times, returns the existing instance (singleton per key).
 */
function createRelay<
	TDefaultConfig extends RelayConfig = DefaultConfig,
	TBase extends {} = DefaultActionStepBase,
	TSuccess extends {} = DefaultActionStepSuccess,
	TError extends {} = DefaultActionStepError,
>(instanceKey: string = DEFAULT_INSTANCE_KEY, config?: TDefaultConfig) {
	if (!stepperInstances.has(instanceKey)) {
		stepperInstances.set(instanceKey, relay<TDefaultConfig, TBase, TSuccess, TError>(config));
	}

	return stepperInstances.get(instanceKey) as {
		relay: ReturnType<typeof relay<TDefaultConfig, TBase, TSuccess, TError>>["relay"];
		//
		useRelay: ReturnType<typeof relay<TDefaultConfig, TBase, TSuccess, TError>>["useRelay"];
		createRelayStep: ReturnType<typeof relay<TDefaultConfig, TBase, TSuccess, TError>>["createRelayStep"];
		StepSuccess: ReturnType<typeof relay<TDefaultConfig, TBase, TSuccess, TError>>["StepSuccess"];
		StepError: ReturnType<typeof relay<TDefaultConfig, TBase, TSuccess, TError>>["StepError"];
	};
}

export { createRelay };
