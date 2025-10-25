import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/message-port";
import type { ContractRouterClient } from "@orpc/contract";
import { implement } from "@orpc/server";
import { RPCHandler } from "@orpc/server/message-port";
import { protocol } from "./protocol";
import type { Event } from "./schema";

const syncServerImplement = implement(protocol);

type Client = ContractRouterClient<typeof protocol>;
const clients: Set<Client> = new Set();

const history: Event[] = [];

const syncServer = syncServerImplement.router({
  publish: syncServerImplement.publish.handler(({ input }) => {
    console.log("receive events", input);
    history.push(input);

    for (const client of clients.values()) {
      client.publish(input);
    }
  }),
});

const handler = new RPCHandler(syncServer);

globalThis.addEventListener("connect", (event) => {
  const port = event.ports[0];
  const link = new RPCLink({ port });
  const client: ContractRouterClient<typeof protocol> = createORPCClient(link);

  clients.add(client);

  handler.upgrade(port);

  port.start();

  port.addEventListener("messageerror", () => {
    clients.delete(client);
  });

  for (const event of history) {
    client.publish(event);
  }
});
