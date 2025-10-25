import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/message-port";
import type { ContractRouterClient } from "@orpc/contract";
import { implement } from "@orpc/server";
import { RPCHandler } from "@orpc/server/message-port";
import { crdt } from "./global";
import { protocol } from "./protocol";

const worker = new SharedWorker(
  new URL("./sync-worker.worker.ts", import.meta.url),
  { type: "module" },
);
const serverPort = worker.port;

const link = new RPCLink({ port: worker.port });
export const client: ContractRouterClient<typeof protocol> =
  createORPCClient(link);

const syncImplement = implement(protocol);

const syncServer = syncImplement.router({
  publish: syncImplement.publish.handler(({ input }) => {
    console.log("receive", input);
    crdt.push(input);
  }),
});

const handler = new RPCHandler(syncServer);

handler.upgrade(serverPort);

serverPort.start();
