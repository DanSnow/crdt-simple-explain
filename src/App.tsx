import { useState } from "react";
import "./App.css";
import { type EditEvent, Editor } from "./Editor";

function App() {
  const [edits, setEdit] = useState<EditEvent[]>([]);
  return (
    <div>
      <Editor
        onEdit={(event) => setEdit((oldEdits) => [...oldEdits, ...event])}
      />
      <output>{JSON.stringify(edits)}</output>
    </div>
  );
}

export default App;
