import invariant from "tiny-invariant";

interface ID {
  client: number;
  clock: number;
}

interface PosNode {
  pos: number;
  children: TextNode[];
}

interface TextNode {
  id: ID;
  text: string;
}

interface CrdtEvent {
  type: "insert" | "delete";
  leftNode: ID;
  id: ID;
  text: string;
}

export class Crdt {
  inserts: PosNode[] = [];
  deletes: ID[] = [];
  // a 32 bit random integer
  // biome-ignore lint/style/noMagicNumbers: 32 bit random number
  client = Math.floor(Math.random() * 2 ** 32);
  clock = 0;

  events: CrdtEvent[] = [];

  insert(pos: number, text: string) {
    const id = {
      client: this.client,
      clock: this.clock++,
    };

    const posNodeIndex = this.inserts.findIndex((node) => node.pos <= pos);
    const posNode =
      posNodeIndex !== -1 ? this.inserts[posNodeIndex] : undefined;
    if (!posNode) {
      invariant(pos === 0, "insert out of range");
      this.inserts.push({
        pos,
        children: [
          {
            id,
            text,
          },
        ],
      });
      this.events.push({
        id,
        // use a special id to repersent start
        leftNode: {
          client: 0,
          clock: 0,
        },
        text,
        type: "insert",
      });
      return;
    }

    const diff = pos - posNode.pos;
    const left: ID =
      diff !== 0
        ? posNode.children[diff - 1].id
        : getRightMostNode(this.inserts[posNodeIndex - 1]).id;
    posNode.children.splice(diff, 0, {
      id,
      text,
    });

    for (let i = posNodeIndex + 1; i < this.inserts.length; ++i) {
      this.inserts[i].pos += 1;
    }
    this.events.push({
      id,
      leftNode: left,
      text,
      type: "insert",
    });
  }

  delete(pos: number) {
    const posNodeIndex = this.inserts.findIndex((node) => node.pos <= pos);
    const posNode =
      posNodeIndex !== -1 ? this.inserts[posNodeIndex] : undefined;

    invariant(posNode, "delete out of range");
    const diff = pos - posNode.pos;
    const id = posNode.children[diff].id;
    this.deletes.push(id);
    posNode.children.splice(diff, 1);
    for (let i = posNodeIndex + 1; i < this.inserts.length; ++i) {
      this.inserts[i].pos -= 1;
    }
    this.events.push({
      type: "delete",
      id,
      // no left node for delete
      leftNode: {
        client: 0,
        clock: 0,
      },
      text: "",
    });
    this.clock += 1;
  }

  toText() {
    return this.inserts
      .flatMap((node) => node.children)
      .map((node) => node.text)
      .join("");
  }

  addEvent(event: CrdtEvent) {
    if (event.type === "insert") {
      this._addInsertEvent(event);
    } else {
      this._addDeleteEvent(event);
    }
  }

  _addInsertEvent(event: CrdtEvent) {
    invariant(event.type === "insert");
    // special case, insert at start
    if (event.leftNode.client === 0) {
      this.inserts.unshift({
        pos: 0,
        children: [
          {
            id: event.id,
            text: event.text,
          },
        ],
      });
      for (let i = 1; i < this.inserts.length; ++i) {
        this.inserts[i].pos += 1;
      }
      this.events.push(event);
      this.clock = Math.max(this.clock, event.id.clock) + 1;
      return;
    }
    let posNodeIndex = -1;
    let diff = -1;
    let found = false;
    for (let i = 0; i < this.inserts.length; ++i) {
      for (const [index, child] of this.inserts[i].children.entries()) {
        if (
          child.id.client === event.leftNode.client &&
          child.id.clock === event.leftNode.clock
        ) {
          found = true;
          posNodeIndex = i;
          diff = index;
          break;
        }
      }

      if (found === true) {
        break;
      }
    }
    invariant(found, "invalid event");

    const posNode = this.inserts[posNodeIndex];
    posNode.children.splice(diff + 1, 0, {
      id: event.id,
      text: event.text,
    });
    for (let i = posNodeIndex + 1; i < this.inserts.length; ++i) {
      this.inserts[i].pos += 1;
    }
    this.events.push(event);
    // this is how logical clock work
    this.clock = Math.max(this.clock, event.id.clock) + 1;
  }

  _addDeleteEvent(event: CrdtEvent) {
    invariant(event.type === "insert");

    let posNodeIndex = -1;
    let diff = -1;
    let found = false;
    for (let i = 0; i < this.inserts.length; ++i) {
      for (const [index, child] of this.inserts[i].children.entries()) {
        if (
          child.id.client === event.leftNode.client &&
          child.id.clock === event.leftNode.clock
        ) {
          found = true;
          posNodeIndex = i;
          diff = index;
          break;
        }
      }

      if (found === true) {
        break;
      }
    }
    invariant(found, "invalid event");

    const posNode = this.inserts[posNodeIndex];
    posNode.children.splice(diff, 1);
    for (let i = posNodeIndex + 1; i < this.inserts.length; ++i) {
      this.inserts[i].pos -= 1;
    }
    this.deletes.push(event.id);
    this.events.push(event);
    // this is how logical clock work
    this.clock = Math.max(this.clock, event.id.clock) + 1;
  }
}

function getRightMostNode(node: PosNode): TextNode {
  const textNode = node.children.at(-1);
  invariant(textNode, "node not found");
  return textNode;
}
