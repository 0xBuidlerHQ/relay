import type { Sidebar as SidebarPrimitive } from "vocs";
import { Links } from "./links";

const Sidebar: SidebarPrimitive = [
	{
		text: "Introduction",
		items: [
			{
				text: "Why Relay",
				link: Links.Introduction.whyRelay,
			},
			{
				text: "Installation",
				link: Links.Introduction.installation,
			},
			{
				text: "Getting Started",
				link: Links.Introduction.gettingStarted,
			},
			{
				text: "FAQ",
				link: Links.Introduction.faq,
			},
		],
	},
	{
		text: "Examples",
		items: [
			{
				text: "Simple Example",
				link: Links.Examples.simpleExample,
			},
		],
	},
];

export { Sidebar };
