import * as z from "zod";

export const EventSchema = z.object({
  id: z.uuidv4(),
  action: z.literal(["inc", "dec"]),
});

export type Event = z.infer<typeof EventSchema>;
