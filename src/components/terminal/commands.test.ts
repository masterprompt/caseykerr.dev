import { describe, it, expect } from "vitest";
import {
  COMMANDS,
  findCommand,
  listedCommands,
  commandNotFoundMessage,
  AUTO_DEMO_COMMANDS,
  type CommandLine,
} from "./commands";

describe("registry", () => {
  it("findCommand returns the command by exact name", () => {
    expect(findCommand("whoami")?.name).toBe("whoami");
    expect(findCommand("about")?.name).toBe("about");
  });

  it("findCommand returns undefined for unknown names", () => {
    expect(findCommand("nonexistent-command-xyz")).toBeUndefined();
  });

  it("findCommand is case-sensitive (the live shell does not lowercase)", () => {
    expect(findCommand("WHOAMI")).toBeUndefined();
  });

  it("listedCommands excludes hidden commands", () => {
    const visible = listedCommands().map((c) => c.name);
    const hidden = COMMANDS.filter((c) => c.hidden).map((c) => c.name);
    expect(hidden.length).toBeGreaterThan(0);
    for (const h of hidden) {
      expect(visible).not.toContain(h);
    }
  });

  it("every command has a non-empty name and description", () => {
    for (const c of COMMANDS) {
      expect(c.name).toBeTruthy();
      expect(c.description).toBeTruthy();
    }
  });
});

describe("section commands", () => {
  const sections = ["about", "now", "work", "projects", "skills", "contact"];

  it.each(sections)("`%s` returns scrollTo target", (id) => {
    const result = findCommand(id)!.run([]);
    expect(result.scrollTo).toBe(id);
    expect(result.lines).toBeUndefined();
  });
});

describe("ls", () => {
  it("emits a command-list of all section names", () => {
    const result = findCommand("ls")!.run([]);
    expect(result.lines).toHaveLength(1);
    const line = result.lines![0];
    expect(line.kind).toBe("command-list");
    if (line.kind !== "command-list") throw new Error("type narrow");
    expect(line.commandNames).toEqual([
      "about",
      "now",
      "work",
      "projects",
      "skills",
      "contact",
    ]);
  });
});

describe("help", () => {
  it("emits a header plus one help-row per listed command", () => {
    const result = findCommand("help")!.run([]);
    const lines = result.lines!;
    expect(lines[0]).toEqual({
      kind: "output",
      text: "Available commands:",
    });

    const rows = lines.slice(1);
    expect(rows.length).toBe(listedCommands().length);

    for (const row of rows) {
      expect(row.kind).toBe("help-row");
      if (row.kind !== "help-row") throw new Error("type narrow");
      expect(row.commandName).toBeTruthy();
      expect(row.description).toBeTruthy();
    }
  });

  it("help-row descriptions match the registry descriptions", () => {
    const result = findCommand("help")!.run([]);
    const rows = result
      .lines!.slice(1)
      .filter((l): l is Extract<CommandLine, { kind: "help-row" }> =>
        l.kind === "help-row",
      );
    for (const row of rows) {
      expect(row.description).toBe(findCommand(row.commandName)!.description);
    }
  });

  it("does not list hidden commands", () => {
    const result = findCommand("help")!.run([]);
    const rowNames = result
      .lines!.slice(1)
      .filter((l): l is Extract<CommandLine, { kind: "help-row" }> =>
        l.kind === "help-row",
      )
      .map((r) => r.commandName);
    for (const c of COMMANDS) {
      if (c.hidden) {
        expect(rowNames).not.toContain(c.name);
      }
    }
  });
});

describe("clear", () => {
  it("returns the clear flag and no lines", () => {
    const result = findCommand("clear")!.run([]);
    expect(result.clear).toBe(true);
    expect(result.lines).toBeUndefined();
  });
});

describe("whoami", () => {
  it("emits a single output line", () => {
    const result = findCommand("whoami")!.run([]);
    expect(result.lines).toHaveLength(1);
    expect(result.lines![0].kind).toBe("output");
  });
});

describe("ask", () => {
  it("errors when called with no question", () => {
    const result = findCommand("ask")!.run([]);
    expect(result.lines).toHaveLength(1);
    expect(result.lines![0].kind).toBe("error");
    expect(result.async).toBeUndefined();
  });

  it("errors when called with only whitespace", () => {
    const result = findCommand("ask")!.run(["   ", "  "]);
    expect(result.lines![0].kind).toBe("error");
    expect(result.async).toBeUndefined();
  });

  it("returns placeholder + async when given a question", () => {
    const result = findCommand("ask")!.run(["what", "is", "your", "stack"]);
    expect(result.lines).toHaveLength(1);
    expect(result.lines![0].kind).toBe("output");
    expect(result.async).toBeInstanceOf(Function);
  });
});

describe("hidden commands", () => {
  it("sudo returns the permission-denied error line", () => {
    const result = findCommand("sudo")!.run([]);
    expect(result.lines![0].kind).toBe("error");
  });

  it("dance emits an image then an output line", () => {
    const lines = findCommand("dance")!.run([]).lines!;
    expect(lines[0].kind).toBe("image");
    expect(lines[1].kind).toBe("output");
  });

  it("vim emits an instant line plus a delayed wake-up line", () => {
    const result = findCommand("vim")!.run([]);
    expect(result.lines![0].kind).toBe("output");
    expect(result.delayedLines).toHaveLength(1);
    expect(result.delayedLines![0].delayMs).toBeGreaterThan(0);
  });

  it("rm only emits delayed lines (no instant output)", () => {
    const result = findCommand("rm")!.run([]);
    expect(result.lines).toBeUndefined();
    expect(result.delayedLines!.length).toBeGreaterThan(0);
  });
});

describe("commandNotFoundMessage", () => {
  it("includes the offending name", () => {
    const msg = commandNotFoundMessage("flarp");
    expect(msg.toLowerCase()).toContain("flarp");
  });
});

describe("AUTO_DEMO_COMMANDS", () => {
  it("only references real registered commands", () => {
    for (const cmd of AUTO_DEMO_COMMANDS) {
      const name = cmd.split(/\s+/)[0];
      expect(findCommand(name)).toBeDefined();
    }
  });
});
