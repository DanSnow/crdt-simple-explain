import { beforeEach, describe, expect, it, vi } from "vitest";
import { Crdt } from "./crdt";

describe("crdt", () => {
  beforeEach(() => {
    // biome-ignore lint/style/noMagicNumbers: make random stable
    vi.spyOn(Math, "random").mockImplementation(() => 0.001);
  });

  it("can insert text", () => {
    const crdt = new Crdt();
    crdt.insert(0, "a");
    expect(crdt.toText()).toBe("a");
    expect(crdt.events).toMatchInlineSnapshot(`
      [
        {
          "id": {
            "client": 4294967,
            "clock": 0,
          },
          "leftNode": {
            "client": 0,
            "clock": 0,
          },
          "text": "a",
          "type": "insert",
        },
      ]
    `);

    crdt.insert(1, "b");
    expect(crdt.toText()).toBe("ab");
    expect(crdt.events).toMatchInlineSnapshot(`
      [
        {
          "id": {
            "client": 4294967,
            "clock": 0,
          },
          "leftNode": {
            "client": 0,
            "clock": 0,
          },
          "text": "a",
          "type": "insert",
        },
        {
          "id": {
            "client": 4294967,
            "clock": 1,
          },
          "leftNode": {
            "client": 4294967,
            "clock": 0,
          },
          "text": "b",
          "type": "insert",
        },
      ]
    `);
  });

  it("can delete text", () => {
    const crdt = new Crdt();
    crdt.insert(0, "a");
    crdt.delete(0);

    expect(crdt.toText()).toBe("");
    expect(crdt.events).toMatchInlineSnapshot(`
      [
        {
          "id": {
            "client": 4294967,
            "clock": 0,
          },
          "leftNode": {
            "client": 0,
            "clock": 0,
          },
          "text": "a",
          "type": "insert",
        },
        {
          "id": {
            "client": 4294967,
            "clock": 0,
          },
          "leftNode": {
            "client": 0,
            "clock": 0,
          },
          "text": "",
          "type": "delete",
        },
      ]
    `);
  });
});
