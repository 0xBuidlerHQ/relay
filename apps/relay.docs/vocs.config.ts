import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vocs";

export default defineConfig({
	/**
	 * @dev Vite config.
	 */
	vite: {
		server: {
			port: 3000,
		},
		plugins: [tsconfigPaths()],
	},

	/**
	 * @dev Vocs config.
	 */
	rootDir: ".",
	title: "Docs",
	logoUrl: {
		light: "/assets/logo-dark.png",
		dark: "/assets/logo-dark.png",
	},
	sidebar: [],
	socials: [
		{
			icon: "github",
			link: "https://github.com/0xbuidler",
		},
		{
			icon: "x",
			link: "https://x.com/maximeisalive",
		},
	],
	theme: {
		accentColor: "#feec0a",

		variables: {
			topNav: {
				horizontalPadding: "10px",
			},
		},
	},
});
