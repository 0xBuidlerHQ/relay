import { defineConfig } from "tsdown";

const tsdownConfig = defineConfig({
	entry: ["./src/index.ts"],
	dts: true,
});

export default tsdownConfig;
