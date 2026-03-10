import { create } from "zustand";

/**
 * @dev A base step in the relay process.
 * This represents a single step, with an ID, a function to execute, and an optional disabled flag.
 * The generic `B` is for extra metadata, `S` is for success payload, and `E` is for error payload.
 */
type RelayStepBase<B, S, _> = B & {
	id: string;
	fn: () => Promise<S>;
	disabled?: boolean | undefined;
};

/**
 * @dev Possible statuses a step can have.
 */
type StepStatus = "idle" | "loading" | "success" | "error" | "disabled";

/**
 * @dev The state of a single step with discriminated union based on status.
 */
type RelayStepStateBase<S> = {
	index: number;
	status: StepStatus;
	promise?: Promise<S>;
};

type RelayStepStateSuccess<S> = RelayStepStateBase<S> & {
	status: "success";
	payload: S;
};

type RelayStepStateError<E, S> = RelayStepStateBase<S> & {
	status: "error";
	payload: E;
};

type RelayStepStateOther<S> = RelayStepStateBase<S> & {
	status: "idle" | "loading" | "disabled";
	payload?: undefined;
};

type RelayStepState<S, E> = RelayStepStateSuccess<S> | RelayStepStateError<E, S> | RelayStepStateOther<S>;

/**
 * @dev Cached state of a step (used when restoring state later).
 * It is the same as RelayStepState but without the index.
 */
type CachedRelayStepStateSuccess<S> = Omit<RelayStepStateSuccess<S>, "index">;

type CachedRelayStepStateError<E, S> = Omit<RelayStepStateError<E, S>, "index">;

type CachedRelayStepStateOther<S> = Omit<RelayStepStateOther<S>, "index">;

type CachedRelayStepState<S, E> =
	| CachedRelayStepStateSuccess<S>
	| CachedRelayStepStateError<E, S>
	| CachedRelayStepStateOther<S>;

/**
 * @dev Configuration options for the relay.
 * - `name`: Identifier for the relay.
 * - `autoExecute`: Whether steps should automatically execute one after another.
 * - `executeOnNext`: Whether the next step should be executed when moving to it.
 */
type RelayConfig = {
	name: string;
	autoExecute?: boolean;
	executeOnNext?: boolean;
};

/**
 * @dev The full state of the relay, including steps, active step, and configuration.
 */
type RelayState<B, S, E> = {
	activeStep: number;
	stepsState: RelayStepState<S, E>[];
	stepsBase: RelayStepBase<B, S, E>[];
	activeRelayStepState: RelayStepState<S, E> | undefined;
	activeRelayStepBase: RelayStepBase<B, S, E> | undefined;
	isRunning: boolean;
	isDone: boolean;
	isError: boolean;
	config: RelayConfig;
};

/**
 * @dev Actions the relay can perform.
 */
type RelayActions<B, S, E> = {
	executeStep: (stepIndex: number) => void;

	setActiveStep: (step: number) => void;
	setStepsState: (state: RelayStepState<S, E>[]) => void;
	setStepsBase: (state: RelayStepBase<B, S, E>[]) => void;
	setIsRunning: (isRunning: boolean) => void;
	setIsDone: (isDone: boolean) => void;
	setIsError: (isError: boolean) => void;

	start: () => void;
	resume: () => void;
	retry: () => void;
	next: () => void;
	prev: () => void;
	reset: () => void;

	initialize: (steps: RelayStepBase<B, S, E>[], newConfig?: RelayConfig) => void;
};

/**
 * @dev The complete Zustand store type that holds both state and actions.
 *
 * This defines the overall shape of the store, which includes both the
 * current state of the relay process and the actions that manipulate it.
 *
 * The generics used are:
 * - `B`: Represents any extra metadata or data that is associated with a step (can be an object type).
 * - `S`: Represents the success payload type when a step completes successfully.
 * - `E`: Represents the error payload type when a step fails.
 */
type RelayStore<B, S, E> = RelayState<B, S, E> & RelayActions<B, S, E>;

/**
 * @dev Return type of `relay`, containing the store hook and step creation function.
 */
type RelayStoreReturn<B, S, E> = {
	useRelay: () => RelayStore<B, S, E>;
	createRelayStep: (props: Omit<RelayStepBase<B, S, E>, "index">) => RelayStepBase<B, S, E>;

	StepSuccess: (data: S) => S;
	StepError: (data: E) => E;
};

/**
 * @dev Creates a Zustand store for managing a step-by-step process.
 *
 * This function returns an object with:
 * - `useRelay`: A Zustand hook for accessing the relay state and actions
 * - `createStep`: A helper function to create properly typed steps for this specific store
 *
 * The generics used are:
 * - `B`: Represents any extra metadata or data that is associated with a step.
 * - `S`: Represents the success payload type when a step completes successfully.
 * - `E`: Represents the error payload type when a step fails.
 */
const relay = <B, S, E>(): RelayStoreReturn<B, S, E> => {
	// Create the Zustand store
	const useRelay = create<RelayStore<B, S, E>>()((set, get) => ({
		activeStep: 0,
		stepsState: [],
		stepsBase: [],
		activeRelayStepState: undefined,
		activeRelayStepBase: undefined,
		isRunning: false,
		isDone: false,
		isError: false,
		config: {
			name: "",
			autoExecute: true,
			executeOnNext: false,
		},

		// State setters
		setActiveStep: (step) => {
			const state = get();
			set({
				activeStep: step,
				activeRelayStepState: state.stepsState[step],
				activeRelayStepBase: state.stepsBase[step],
			});
		},
		setStepsState: (state) => {
			const currentState = get();
			set({
				stepsState: state,
				activeRelayStepState: state[currentState.activeStep],
			});
		},
		setStepsBase: (state) => {
			const currentState = get();
			set({
				stepsBase: state,
				activeRelayStepBase: state[currentState.activeStep],
			});
		},
		setIsRunning: (isRunning) => set({ isRunning }),
		setIsDone: (isDone) => set({ isDone }),
		setIsError: (isError) => set({ isError }),

		// Initialize function
		initialize: (steps, newConfig) => {
			const initialStepsState: RelayStepState<S, E>[] = steps.map((_, index) => ({
				index,
				status: "idle",
			}));

			const stepsBase: RelayStepBase<B, S, E>[] = steps.map((item, index) => ({
				index,
				...item,
			}));

			set({
				stepsState: [...initialStepsState],
				stepsBase: [...stepsBase],
				config: { ...get().config, ...newConfig },
				activeStep: 0,
				activeRelayStepState: initialStepsState[0],
				activeRelayStepBase: stepsBase[0],
				isRunning: false,
				isDone: false,
				isError: false,
			});
		},

		/**
		 * @dev Executes a step by running its function and updating the state accordingly.
		 */
		executeStep: (stepIndex: number) => {
			console.log("Executing: ", stepIndex);
			const state = get();
			const { stepsBase, stepsState, config } = state;

			const stepBase = stepsBase[stepIndex];
			const stepState = stepsState[stepIndex];

			if (!stepBase || !stepState) return;

			const stepPromise = stepBase.fn();

			// Create a new loading state
			const loadingState: RelayStepState<S, E> = {
				index: stepIndex,
				status: "loading",
				promise: stepPromise,
			};

			// Update current step to loading
			stepsState[stepIndex] = loadingState;

			// If the step being executed is the active step, update activeRelayStepState too
			const updates: Partial<RelayState<B, S, E>> = {
				stepsState: [...stepsState],
			};

			if (stepIndex === state.activeStep) {
				updates.activeRelayStepState = loadingState;
			}

			set(updates);

			stepPromise
				.then((data) => {
					// Create success state with properly typed payload
					const successState: RelayStepStateSuccess<S> = {
						index: stepIndex,
						status: "success",
						payload: data,
						promise: stepPromise,
					};

					stepsState[stepIndex] = successState;

					// Prepare updates
					const successUpdates: Partial<RelayState<B, S, E>> = {
						stepsState: [...stepsState],
					};

					// If the step being executed is the active step, update activeRelayStepState too
					if (stepIndex === state.activeStep) {
						successUpdates.activeRelayStepState = successState;
					}

					set(successUpdates);

					if (stepIndex === stepsBase.length - 1) {
						state.setIsRunning(false);
						state.setIsDone(true);
					} else if (config.autoExecute) {
						state.next();
					}
				})
				.catch((error) => {
					// Create error state with properly typed payload
					const errorState: RelayStepStateError<E, S> = {
						index: stepIndex,
						status: "error",
						payload: error as E,
						promise: stepPromise,
					};

					stepsState[stepIndex] = errorState;

					// Prepare updates
					const errorUpdates: Partial<RelayState<B, S, E>> = {
						stepsState: [...stepsState],
					};

					// If the step being executed is the active step, update activeRelayStepState too
					if (stepIndex === state.activeStep) {
						errorUpdates.activeRelayStepState = errorState;
					}

					set(errorUpdates);
					state.setIsRunning(false);
					state.setIsError(true);
				});
		},

		/**
		 * @dev Starts executing the first step in the relay.
		 * If there are steps to run, it marks the process as "running"
		 * and executes the first step (step index 0).
		 */
		start: () => {
			const state = get();
			if (state.stepsState.length > 0) {
				state.setIsRunning(true); // Mark as running
				state.executeStep(0); // Start from the first step
			}
		},

		/**
		 * @dev Resumes execution from the current active step.
		 * If steps exist, it marks the process as "running" and runs the current step.
		 */
		resume: () => {
			const state = get();
			if (state.stepsState.length > 0) {
				state.setIsRunning(true);
				state.executeStep(state.activeStep); // Resume from where we left off
			}
		},

		/**
		 * @dev Retries the current step if it's not already running.
		 * If there was an error before, it resets the error state and tries again.
		 */
		retry: () => {
			const state = get();

			if (!state.isRunning) {
				state.setIsError(false); // Clear any error
				state.setIsRunning(true); // Start running again
				state.executeStep(state.activeStep); // Retry current step
			}
		},

		/**
		 * @dev Moves to the next step in the sequence.
		 * If 'executeOnNext' is enabled in the config, it runs the step immediately.
		 */
		next: () => {
			const state = get();
			const { activeStep, config } = state;

			if (config.executeOnNext) {
				state.executeStep(activeStep);
			}

			if (activeStep < state.stepsState.length - 1) {
				const nextStep = activeStep + 1;
				state.setActiveStep(nextStep);

				if (!config.executeOnNext) {
					state.executeStep(nextStep); // Automatically execute the next step if allowed
				}
			}
		},

		/**
		 * @dev Moves to the previous step in the sequence, if possible.
		 * Does not execute it automatically, just updates the active step.
		 */
		prev: () => {
			const state = get();
			if (state.activeStep > 0) {
				state.setActiveStep(state.activeStep - 1);
			}
		},

		/**
		 * @dev Returns the current relay state.
		 * This allows external components to read the current progress.
		 */
		get: () => {
			const state = get();
			return state;
		},

		/**
		 * @dev Resets the relay to its initial state.
		 * Clears all steps, progress, and resets status flags.
		 */
		reset: () => {
			const state = get();
			state.setStepsState([]); // Clear all steps state
			state.setStepsBase([]); // Clear all step definitions
			state.setActiveStep(0); // Reset to step 0
			set({
				activeRelayStepState: undefined,
				activeRelayStepBase: undefined,
			});
			state.setIsRunning(false); // Mark as not running
			state.setIsDone(false); // Mark as not done
			state.setIsError(false); // Clear any error state
		},
	}));

	// Create a properly typed step creation function
	const createRelayStep = (props: Omit<RelayStepBase<B, S, E>, "index">) => props as RelayStepBase<B, S, E>;

	const StepSuccess = (data: S) => data;
	const StepError = (data: E) => data;

	// Return the store hook and step creation function
	return {
		useRelay,
		createRelayStep,

		StepSuccess,
		StepError,
	};
};

export { relay };

// No longer need the standalone createStep function since
// each store instance returns its own typed createStep

export type {
	RelayStepBase,
	RelayStepState,
	RelayStepStateSuccess,
	RelayStepStateError,
	RelayStepStateOther,
	StepStatus,
	RelayConfig,
	RelayStore,
	RelayStoreReturn,
	CachedRelayStepState,
	CachedRelayStepStateSuccess,
	CachedRelayStepStateError,
	CachedRelayStepStateOther,
};
