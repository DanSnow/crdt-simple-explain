import { useEffect, useSyncExternalStore } from "react";
import "./App.css";
import { useDebouncedCallback } from "use-debounce";
import { client } from "./client";
import { Editor } from "./Editor";
import { crdt } from "./global";

function App() {
  const text = useSyncExternalStore(
    (listener) => crdt.onUpdate(listener),
    () => crdt.toText()
  );

  const sendSyncEvent = useDebouncedCallback(() => {
    const { client: clientId, events } = crdt;
    const syncEvents = crdt.getSyncEvents();
    console.log("publish", { client: clientId, events, syncEvents });
    client.publish({
      client: clientId,
      events: syncEvents,
    });
  }, 1000);

  useEffect(() => {
    client.register({ client: crdt.client });
    const unsubscribe = crdt.onUpdate(() => {
      sendSyncEvent();
    });
    return () => {
      client.unregister({ client: crdt.client });
      unsubscribe();
    };
  }, [sendSyncEvent]);

  return (
    <div>
      <Editor
        onEdit={(edits) => {
          for (const edit of edits) {
            if (edit.type === "insert") {
              crdt.insert(edit.pos, edit.text);
            } else {
              crdt.delete(edit.pos);
            }
          }
        }}
        value={text}
      />
    </div>
  );
}

export default App;
