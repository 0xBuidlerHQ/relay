import { App } from "./app";

import { Footer } from "./footer";
import { Header } from "./header";

const SimpleExample = () => {
	return (
		<div className="bg-neutral-500 p-2 rounded">
			<Header />

			<App />

			<Footer />
		</div>
	);
};

export { SimpleExample };
