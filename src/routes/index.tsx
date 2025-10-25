import { createFileRoute } from "@tanstack/react-router";
import { EditorSample } from "~/components/editor/EditorSample";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <EditorSample />;
}
