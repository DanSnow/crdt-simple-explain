import type { Event } from "./schema";

export type UpdateListener = (event: Event) => void;

export class Crdt {
  existsEvent: Set<string> = new Set();
  events: Event[] = [];

  listeners: Set<UpdateListener> = new Set();

  increment() {
    this.push({
      id: crypto.randomUUID(),
      action: "inc",
    });
  }

  decrease() {
    this.push({
      id: crypto.randomUUID(),
      action: "dec",
    });
  }

  push(event: Event) {
    if (this.existsEvent.has(event.id)) {
      return;
    }
    this.existsEvent.add(event.id);
    this.events.push(event);

    for (const listener of this.listeners) {
      listener(event);
    }
  }

  onUpdate(listener: UpdateListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  toValue(): number {
    return this.events.reduce(
      (n, { action }) => n + (action === "inc" ? 1 : -1),
      0,
    );
  }
}
