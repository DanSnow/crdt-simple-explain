import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/message-port";
import type { ContractRouterClient } from "@orpc/contract";
import { implement } from "@orpc/server";
import { RPCHandler } from "@orpc/server/message-port";
import { crdt } from "./components/editor/global";
import {
	syncRouter,
	type syncServerRouter,
} from "./components/editor/protocol";

const worker = new SharedWorker(
	new URL("./sync-worker.worker.ts", import.meta.url),
	{ type: "module" },
);
const serverPort = worker.port;

const link = new RPCLink({ port: worker.port });
export const client: ContractRouterClient<typeof syncServerRouter> =
	createORPCClient(link);

const syncImplement = implement(syncRouter);

const syncServer = syncImplement.router({
	publish: syncImplement.publish.handler(({ input }) => {
		try {
			if (input.client !== crdt.client) {
				console.log("receive", input);
				crdt.addEvents(input.events);
			}
		} catch (error) {
			console.error(error);
		}
	}),
});

const handler = new RPCHandler(syncServer);

handler.upgrade(serverPort);

serverPort.start();
