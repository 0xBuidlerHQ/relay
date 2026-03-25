import { App } from "./app";

import { Footer } from "./footer";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

/**
 * @dev Simple Example.
 */
const SimpleExample = () => {
	return (
		<div className="bg-black/50 p-2 rounded flex flex-col gap-10">
			<Header />

			<div className="flex justify-between">
				<App />
				<Sidebar />
			</div>

			<Footer />
		</div>
	);
};

export { SimpleExample };
