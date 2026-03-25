import { myRelay } from "./relays";

/**
 * @dev Header.
 */
const Header = () => {
	const { isRunning } = myRelay.useRelay();

	return (
		<div className="bg-white/10 px-2 rounded">
			<div className="flex justify-between">
				<div>Header</div>
				<div>Status: {isRunning ? "Running" : "Idle"}</div>
			</div>
		</div>
	);
};

export { Header };
