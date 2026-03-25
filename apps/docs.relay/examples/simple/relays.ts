import { createRelay } from "@0xbuidlerhq/relay";

/**
 * @dev MyRelay.
 */
export type MyRelayConfig = {};

export type MyRelayStepBase = {
	label: string;
};

export type MyRelayStepTransactionSuccess = {
	type: "transaction";
	txHash: string;
	blockNumber: number;
};

export type MyRelayStepApiCallSuccess = {
	type: "apicall";
};

export type MyRelayStepSuccess = MyRelayStepTransactionSuccess | MyRelayStepApiCallSuccess;

export type MyRelayStepError = {
	message: string;
};

const myRelay = createRelay<MyRelayConfig, MyRelayStepBase, MyRelayStepSuccess, MyRelayStepError>("my-relay");

export { myRelay };
