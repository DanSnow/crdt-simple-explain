import { useEffect, useState } from "react";
import { JSONTree } from "react-json-tree";
import { crdt } from "./global";

export function DevTools() {
  const [state, setState] = useState(null as any);
  useEffect(() => {
    crdt.onUpdate(() =>
      setState({
        events: crdt.events,
        lastSyncClock: crdt.lastSyncClock,
      }),
    );
  }, []);

  return <JSONTree data={state} />;
}
