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
}

function getRightMostNode(node: PosNode): TextNode {
  const textNode = node.children.at(-1);
  invariant(textNode, "node not found");
  return textNode;
}
