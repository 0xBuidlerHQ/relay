import { createRelay } from "@0xhq/relay";

const nodeRelay = createRelay("nodejs-example");
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const summarize = () => {
	const state = nodeRelay.relay.getState();
	return state.stepsState
		.map((step) => {
			const payload = step.status === "success" ? ` payload=${JSON.stringify(step.payload)}` : "";
			return `${step.index}:${step.status}${payload}`;
		})
		.join(" | ");
};

const run = async () => {
	const { relay, createRelayStep, StepSuccess } = nodeRelay;

	const steps = [
		createRelayStep({
			id: "load-config",
			fn: async () => {
				await delay(150);
				console.log("Fetched configuration");
				return StepSuccess({ source: "config" });
			},
		}),
		createRelayStep({
			id: "call-service",
			fn: async () => {
				await delay(250);
				console.log("Service call completed");
				return StepSuccess({ source: "service", duration: 250 });
			},
		}),
		createRelayStep({
			id: "record-metric",
			fn: async () => {
				await delay(100);
				console.log("Metric recorded");
				return StepSuccess({ source: "metric" });
			},
		}),
	];

	relay.initialize(steps);
	console.log("Initialized relay:", summarize());

	relay.start();

	while (relay.getState().isRunning) {
		await delay(50);
		console.log("Progress:", summarize());
	}

	console.log("Final summary:", summarize());
};

run();
