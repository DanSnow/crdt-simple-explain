import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">CRDT Examples</h1>
      <p className="mb-4">
        Explore different Conflict-free Replicated Data Type (CRDT)
        implementations:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <Link to="/editor" className="text-blue-500 hover:underline">
            Collaborative Text Editor
          </Link>
        </li>
        <li>
          <Link to="/counter" className="text-blue-500 hover:underline">
            Simple Counter
          </Link>
        </li>
      </ul>
    </div>
  );
}
