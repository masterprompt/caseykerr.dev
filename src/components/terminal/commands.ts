/**
 * Command registry for the Terminal hero (CONTEXT.md).
 *
 * Adding a Command is a one-line entry in COMMANDS. Hidden commands are
 * supported via `hidden: true`; they execute but are excluded from `help`
 * and tab completion. Easter-egg Hidden commands arrive in #11; the `ask`
 * Command lands in #05; `resume` lands in #08.
 */

export type CommandLine =
  | { kind: "echo"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string };

export type CommandResult = {
  lines?: CommandLine[];
  scrollTo?: string;
  clear?: boolean;
};

export type CommandDef = {
  name: string;
  description: string;
  hidden?: boolean;
  run: (args: string[]) => CommandResult;
};

const SECTIONS: { id: string; description: string }[] = [
  { id: "about", description: "About Casey" },
  { id: "now", description: "What Casey is up to right now" },
  { id: "work", description: "Selected career highlights" },
  { id: "projects", description: "Published games and side projects" },
  { id: "skills", description: "Tech stack" },
  { id: "contact", description: "Get in touch" },
];

const sectionCommands: CommandDef[] = SECTIONS.map((s) => ({
  name: s.id,
  description: s.description,
  run: () => ({ scrollTo: s.id }),
}));

const helpCommand: CommandDef = {
  name: "help",
  description: "List available commands",
  run: () => ({
    lines: [
      { kind: "output", text: "Available commands:" },
      ...listedCommands().map((c) => ({
        kind: "output" as const,
        text: `  ${c.name.padEnd(10)}  ${c.description}`,
      })),
    ],
  }),
};

const clearCommand: CommandDef = {
  name: "clear",
  description: "Clear the terminal output",
  run: () => ({ clear: true }),
};

export const COMMANDS: CommandDef[] = [
  ...sectionCommands,
  helpCommand,
  clearCommand,
];

export function listedCommands(): CommandDef[] {
  return COMMANDS.filter((c) => !c.hidden);
}

export function findCommand(name: string): CommandDef | undefined {
  return COMMANDS.find((c) => c.name === name);
}

/**
 * Auto-demo plays these in sequence on page load. The `help` step calls the
 * real help handler so the demo stays in sync as later slices add commands.
 */
export const AUTO_DEMO: {
  command: string;
  response: () => CommandLine[];
}[] = [
  {
    command: "whoami",
    response: () => [
      { kind: "output", text: "Casey Kerr — senior full-stack engineer" },
    ],
  },
  {
    command: "ls projects/",
    response: () => [
      {
        kind: "output",
        text: "endboss-games/  waukesha-makerspace/  kerrsoft/  resumatic/",
      },
    ],
  },
  {
    command: "help",
    response: () => helpCommand.run([]).lines ?? [],
  },
];
