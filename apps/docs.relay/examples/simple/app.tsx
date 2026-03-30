import { myRelay } from "./relays";

/**
 * @dev Create steps.
 */
const steps = [
	myRelay.createRelayStep({
		id: "id-0",
		label: "API call",
		fn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return myRelay.StepSuccess({ type: "apicall" });
		},
	}),
	myRelay.createRelayStep({
		id: "id-1",
		label: "Send Tx",
		fn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return myRelay.StepSuccess({
				type: "transaction",
				txHash: "0x",
				blockNumber: 100_000_000,
			});
		},
	}),
	myRelay.createRelayStep({
		id: "id-2",
		label: "API call",
		fn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return myRelay.StepSuccess({ type: "apicall" });
		},
	}),
];

/**
 * @dev App.
 */
const App = () => {
	const { initialize, start, reset, canStart, canInitialize } = myRelay.useRelay();

	return (
		<div className="flex gap-4">
			<div className={!canInitialize ? "opacity-50 pointer-events-none" : ""}>
				<button
					type="button"
					className="bg-cyan-500/20 text-cyan-500 rounded px-2"
					onClick={() => {
						initialize(steps);
					}}
				>
					Initialize
				</button>
			</div>

			<div className={!canStart ? "opacity-50 pointer-events-none" : ""}>
				<button
					type="button"
					className="bg-amber-500/20 text-amber-500 rounded px-2"
					onClick={() => {
						start();
					}}
				>
					Start
				</button>
			</div>

			<div>
				<button
					type="button"
					className="bg-purple-500/20 text-purple-500 rounded px-2"
					onClick={() => {
						reset();
					}}
				>
					Reset
				</button>
			</div>
		</div>
	);
};

export { App };
