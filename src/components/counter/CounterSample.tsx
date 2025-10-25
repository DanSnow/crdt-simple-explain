import { useSyncExternalStore } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { crdt } from "./global";

export function CounterSample() {
  const count = useSyncExternalStore(
    (cb) => crdt.onUpdate(cb),
    () => crdt.toValue(),
  );
  return (
    <div className="p-8">
      <div className="flex items-center flex-col justify-center">
        <output className="text-4xl p-4 font-bold">{count}</output>
        <ButtonGroup>
          <Button onClick={() => crdt.increment()}>+1</Button>
          <Button onClick={() => crdt.decrease()}>-1</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
