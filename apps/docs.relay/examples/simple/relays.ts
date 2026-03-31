import { createRelay } from "@0xhq/relay";

/**
 * @dev MyRelay.
 */
type MyRelayConfig = {};

type MyRelayStepBase = {
	label: string;
};

type MyRelayStepTransactionSuccess = {
	type: "transaction";
	txHash: string;
	blockNumber: number;
};

type MyRelayStepApiCallSuccess = {
	type: "apicall";
};

type MyRelayStepSuccess = MyRelayStepTransactionSuccess | MyRelayStepApiCallSuccess;

type MyRelayStepError = {
	message: string;
};

const myRelay = createRelay<MyRelayConfig, MyRelayStepBase, MyRelayStepSuccess, MyRelayStepError>("my-relay");

export { myRelay };
