import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/message-port";
import type { ContractRouterClient } from "@orpc/contract";
import { implement } from "@orpc/server";
import { RPCHandler } from "@orpc/server/message-port";
import {
  type PublishInput,
  type syncRouter,
  syncServerRouter,
} from "./protocol";

const syncServerImplement = implement(syncServerRouter).$context<{
  client: ContractRouterClient<typeof syncRouter>;
}>();

interface Client {
  id: number;
  client: ContractRouterClient<typeof syncRouter>;
}

const clients: Map<number, Client> = new Map();

const history: PublishInput[] = [];

const syncServer = syncServerImplement.router({
  publish: syncServerImplement.publish.handler(({ input }) => {
    if (input.events.length === 0) {
      return;
    }
    console.log("receive events", input);
    history.push(input);

    for (const client of clients.values()) {
      if (client.id !== input.client) {
        client.client.publish(input);
      }
    }
  }),
  register: syncServerImplement.register.handler(({ input, context }) => {
    if (clients.has(input.client)) {
      return;
    }
    for (const item of history) {
      context.client.publish(item);
    }
    clients.set(input.client, {
      id: input.client,
      client: context.client,
    });
    console.log(clients);
  }),
  unregister: syncServerImplement.unregister.handler(({ input }) => {
    clients.delete(input.client);
  }),
});

const handler = new RPCHandler(syncServer);

globalThis.addEventListener("connect", (event) => {
  const port = event.ports[0];
  const link = new RPCLink({ port });
  const client: ContractRouterClient<typeof syncRouter> =
    createORPCClient(link);

  handler.upgrade(port, {
    context: {
      client,
    },
  });

  port.start();
});
