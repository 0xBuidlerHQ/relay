import { createRelay } from "@0xbuidlerhq/relay";

/**
 * @dev MyRelay.
 */
export type MyRelayConfig = {};

export type MyRelayStepBase = {
	label: string;
};

export type MyRelayStepSuccess = {
	txHash: string;
	blockNumber: number;
};

export type MyRelayStepError = {
	message: string;
};

const myRelay = createRelay<MyRelayConfig, MyRelayStepBase, MyRelayStepSuccess, MyRelayStepError>("my-relay");

export { myRelay };
