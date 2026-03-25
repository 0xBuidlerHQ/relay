"use client";

import { createRelay } from "@0xbuidlerhq/relay";

/**
 * @dev
 */
const myRelay = createRelay("my-relay");

const LoadSteps = () => {
	const { initialize, start } = myRelay.useRelay();

	return (
		<div>
			<button
				type="button"
				onClick={() => {
					initialize([
						myRelay.createRelayStep({
							id: "id-0",
							fn: async () => {
								await new Promise((resolve) => setTimeout(resolve, 1000));
								return myRelay.StepSuccess({});
							},
						}),
						myRelay.createRelayStep({
							id: "id-1",
							fn: async () => {
								await new Promise((resolve) => setTimeout(resolve, 1000));
								return myRelay.StepSuccess({});
							},
						}),
						myRelay.createRelayStep({
							id: "id-2",
							fn: async () => {
								await new Promise((resolve) => setTimeout(resolve, 1000));
								return myRelay.StepSuccess({});
							},
						}),
					]);

					start();
				}}
			>
				initialize
			</button>
		</div>
	);
};

const View = () => {
	const { stepsBase, stepsState } = myRelay.useRelay();

	return (
		<div className="flex flex-col gap-1">
			{stepsBase.map((step, index) => {
				const stepState = stepsState[index];

				return (
					<div key={step.id} className="flex gap-2">
						<div>{step.id}</div>
						<div>{stepState.status}</div>
					</div>
				);
			})}
		</div>
	);
};

export { LoadSteps, View };
