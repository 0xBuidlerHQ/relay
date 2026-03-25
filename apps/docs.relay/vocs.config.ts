import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vocs";
import { Sidebar } from "./config/sidebar";

export default defineConfig({
	/**
	 * @dev Vite config.
	 */
	vite: {
		server: {
			port: 4000,
		},
		plugins: [tsconfigPaths()],
	},

	/**
	 * @dev Vocs config.
	 */
	rootDir: ".",
	title: "Docs",
	logoUrl: {
		light: "/assets/logo-light.svg",
		dark: "/assets/logo-dark.svg",
	},
	sidebar: Sidebar,
	socials: [
		{
			icon: "github",
			link: "https://github.com/0xBuidlerHQ/relay",
		},
		{
			icon: "x",
			link: "https://x.com/maximeisalive",
		},
	],
	theme: {
		accentColor: {
			light: "#ff9318",
			dark: "#ffc517",
		},

		variables: {
			color: {
				background: {
					dark: "#1A191B",
					light: "#1A191B",
				},
			},
			topNav: {
				horizontalPadding: "10px",
			},
		},
	},
});
