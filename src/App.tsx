import { useSyncExternalStore } from "react";
import "./App.css";
import { Crdt } from "./crdt";
import { Editor } from "./Editor";

const crdt = new Crdt();

function App() {
  const text = useSyncExternalStore(
    (listener) => crdt.onUpdate(listener),
    () => crdt.toText()
  );
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
