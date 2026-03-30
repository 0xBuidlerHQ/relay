import { describe, expect, it, vi } from "vitest";

import { createRelay } from "../src/index";
import type { RelayConfig } from "../src/relay";

/**
 * @dev
 */
const uniqueKey = () => `relay-test-${Math.random().toString(36).slice(2)}`;

/**
 * @dev Relay Tests.
 */
describe("Relay", () => {
	/**
	 * @dev Initialization.
	 */
	describe("Initialization", () => {
		it("reuses the same instance when the key is reused", () => {
			const key = uniqueKey();

			const first = createRelay(key, {});
			const second = createRelay(key, {});

			expect(first).toBe(second);
		});

		it("proper state upon creation", () => {
			const { relay } = createRelay(uniqueKey(), {});
			const state = relay.getState();

			expect(state.stepsState.length).toBe(0);
			expect(state.stepsBase.length).toBe(0);

			expect(state.activeStep).toBe(0);

			expect(state.activeRelayStepState).toBeUndefined();
			expect(state.activeRelayStepBase).toBeUndefined();

			expect(state.isRunning).toBeFalsy();
			expect(state.isDone).toBeFalsy();
			expect(state.isError).toBeFalsy();

			expect(state.config).toMatchObject({ autoNextExecute: true, executeOnNext: false } as RelayConfig);
		});
	});

	it("initializes steps with idle state and exposed metadata", () => {
		const { relay, createRelayStep, StepSuccess } = createRelay(uniqueKey(), {});

		const step_1 = { id: "Step-1", fn: vi.fn(async () => StepSuccess({})) };
		const step_2 = { id: "Step-2", fn: vi.fn(async () => StepSuccess({})) };

		const steps = [
			//
			createRelayStep(step_1),
			createRelayStep(step_2),
		];

		relay.getState().initialize(steps);
		const state = relay.getState();

		expect(state.stepsState).toHaveLength(2);
		expect(state.stepsBase.map((entry) => entry.id)).toEqual([step_1.id, step_2.id]);
		expect(state.activeStep).toBe(0);
		expect(state.activeRelayStepState?.status).toBe("idle");
		expect(state.activeRelayStepBase?.id).toBe(step_1.id);
		expect(state.isRunning).toBe(false);
		expect(state.isDone).toBe(false);

		expect(state.canStart).toBe(true);

		expect(state.canNext).toBe(false);
		expect(state.canRetry).toBe(false);
		expect(state.canResume).toBe(false);
	});

	/**
	 * @dev Happy Path.
	 */
	describe("happy path", () => {
		it("runs the steps sequentially and marks the flow as done", async () => {
			const { relay, createRelayStep, StepSuccess } = createRelay(uniqueKey(), {});

			const step_1 = { id: "Step-1", fn: vi.fn(async () => StepSuccess({})) };
			const step_2 = { id: "Step-2", fn: vi.fn(async () => StepSuccess({})) };

			const steps = [
				createRelayStep({ id: step_1.id, fn: step_1.fn }),
				createRelayStep({ id: step_2.id, fn: step_2.fn }),
			];

			relay.getState().initialize(steps);
			relay.getState().start();

			// Allow async promises from both steps to settle.
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();

			expect(step_1.fn).toHaveBeenCalledOnce();
			expect(step_2.fn).toHaveBeenCalledOnce();

			const state = relay.getState();

			expect(state.stepsState).toHaveLength(2);
			expect(state.stepsState.map((entry) => entry.status)).toEqual(["success", "success"]);

			expect(state.stepsBase.map((entry) => entry.id)).toEqual([step_1.id, step_2.id]);

			expect(state.activeStep).toBe(1);

			expect(state.activeRelayStepState?.status).toBe("success");
			expect(state.activeRelayStepBase?.id).toBe(step_2.id);

			expect(state.isRunning).toBe(false);
			expect(state.isDone).toBe(true);

			expect(state.activeRelayStepState?.payload).toMatchObject({});
		});
	});
});
