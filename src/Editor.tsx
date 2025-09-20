import React from "react";

export interface EditEvent {
  type: "insert" | "delete";
  text: string;
  pos: number;
}

interface Props {
  onEdit?: (edits: EditEvent[]) => void;
}

export function Editor({ onEdit = console.log }: Props) {
  const [text, setText] = React.useState("");
  const previousText = React.useRef("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    const oldText = previousText.current;

    const edits = [
      detectInsertions(newText, oldText),
      detectDeletions(newText, oldText),
    ].filter((x: EditEvent | undefined): x is EditEvent => Boolean(x));

    setText(newText);
    onEdit(edits);
    previousText.current = newText;
  };

  return <textarea onChange={handleChange} value={text} />;
}

function diffInsertion(newText: string, oldText: string) {
  let insertedContent = "";
  let insertionPosition = -1;

  for (let i = 0; i < newText.length; i++) {
    if (oldText[i] !== newText[i]) {
      insertionPosition = i;
      insertedContent = newText.substring(
        i,
        i + (newText.length - oldText.length)
      );
      break;
    }
  }
  return { insertionPosition, insertedContent };
}

function detectInsertions(
  newText: string,
  oldText: string
): EditEvent | undefined {
  if (newText.length <= oldText.length) {
    return;
  }

  let { insertionPosition, insertedContent } = diffInsertion(newText, oldText);

  if (insertionPosition === -1 && newText.length > 0) {
    insertionPosition = 0;
    insertedContent = newText;
  } else if (
    insertionPosition === -1 &&
    newText.length > oldText.length &&
    oldText.length > 0
  ) {
    insertionPosition = oldText.length;
    insertedContent = newText.substring(oldText.length);
  }

  if (insertedContent !== "" && insertionPosition !== -1) {
    return { type: "insert", text: insertedContent, pos: insertionPosition };
  }
}

function detectDeletions(
  newText: string,
  oldText: string
): EditEvent | undefined {
  if (newText.length >= oldText.length) {
    return;
  }

  let deletedContent = "";
  let deletionPosition = -1;

  for (let i = 0; i < oldText.length; i++) {
    if (oldText[i] !== newText[i]) {
      deletionPosition = i;
      deletedContent = oldText.substring(
        i,
        i + (oldText.length - newText.length)
      );
      break;
    }
  }

  if (deletedContent !== "" && deletionPosition !== -1) {
    return { type: "delete", text: deletedContent, pos: deletionPosition };
  }
}
