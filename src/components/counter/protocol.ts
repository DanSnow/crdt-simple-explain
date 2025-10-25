import { oc } from "@orpc/contract";
import { EventSchema } from "./schema";

export const protocol = oc.router({
  publish: oc.input(EventSchema),
});
