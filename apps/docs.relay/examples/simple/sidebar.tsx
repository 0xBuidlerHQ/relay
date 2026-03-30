import { myRelay } from "./relays";

/**
 * @dev Sidebar.
 */
const Sidebar = () => {
	const { stepsBase, stepsState } = myRelay.useRelay();

	return (
		<div className="bg-slate-600">
			<h4 className="underline">Sidebar</h4>

			{stepsBase.map((item, index) => {
				const state = stepsState[index];

				return (
					<div className="flex gap-2" key={item.id}>
						<div>{item.label}</div>

						{(() => {
							if (state.status === "success") {
								const payload = state.payload;

								if (payload.type === "apicall") {
									return <div>Success</div>;
								}

								if (payload.type === "transaction") {
									return (
										<div className="flex gap-2">
											<div>{payload.txHash}</div>
											<div>{payload.blockNumber}</div>
										</div>
									);
								}
							}

							if (state.status === "error") {
								return <div>{state.payload.message}</div>;
							}

							return <div>{state.status}</div>;
						})()}
					</div>
				);
			})}
		</div>
	);
};

export { Sidebar };
