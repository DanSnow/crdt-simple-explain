import { oc } from "@orpc/contract";
import { z } from "zod";

const IDSchema = z.object({
  client: z.number(),
  clock: z.number(),
});

export type ID = z.infer<typeof IDSchema>;

const CrdtEventSchema = z.object({
  type: z.literal(["insert", "delete"]),
  leftNode: IDSchema,
  id: IDSchema,
  text: z.string(),
});

export type CrdtEvent = z.infer<typeof CrdtEventSchema>;

const PublishInputSchema = z.object({
  client: z.number(),
  events: z.array(CrdtEventSchema),
});

export type PublishInput = z.infer<typeof PublishInputSchema>;

const publish = oc.input(PublishInputSchema).output(z.void());

export const syncRouter = oc.router({
  publish,
});

export const syncServerRouter = oc.router({
  ...syncRouter,
  register: oc
    .input(
      z.object({
        client: z.number(),
      })
    )
    .output(z.void()),
  unregister: oc.input(z.object({ client: z.number() })),
});
