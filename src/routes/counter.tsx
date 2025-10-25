import { createFileRoute } from "@tanstack/react-router";
import { CounterSample } from "~/components/counter/CounterSample";

export const Route = createFileRoute("/counter")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CounterSample />;
}
