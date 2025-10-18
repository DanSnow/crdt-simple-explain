import { useEffect, useState, useSyncExternalStore } from "react";
import { useDebouncedCallback } from "use-debounce";
import { client } from "./client";
import { Editor } from "./Editor";
import { crdt } from "./global";
import { DevTools } from "./DevTools";

function App() {
  const [isSyncing, setIsSyncing] = useState(true);

  const text = useSyncExternalStore(
    (listener) => crdt.onUpdate(listener),
    () => crdt.toText()
  );

  const sendSyncEvent = useDebouncedCallback(() => {
    if (!isSyncing) {
      return;
    }
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
      <div>
        <label>
          Sync
          <input
            checked={isSyncing}
            onChange={(event) => setIsSyncing(event.target.checked)}
            type="checkbox"
          />
        </label>
      </div>
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
      <DevTools />
    </div>
  );
}

export default App;
