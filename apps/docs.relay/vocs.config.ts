import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vocs";
import { Sidebar } from "./config/sidebar";

import packageJson from "./package.json";

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
	iconUrl: {
		light: "/assets/logo.svg",
		dark: "/assets/logo.svg",
	},
	logoUrl: {
		light: "/assets/logo.svg",
		dark: "/assets/logo.svg",
	},
	sidebar: Sidebar,
	topNav: [
		{
			text: packageJson.version,
			items: [
				{
					text: "Contributing",
					link: "https://github.com/0xbuidlerhq/relay/blob/main/.github/CONTRIBUTING.md",
				},
			],
		},
	],
	socials: [
		{
			icon: "github",
			link: "https://github.com/0xbuidlerhq/relay",
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
