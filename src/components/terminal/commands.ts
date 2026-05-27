/**
 * Command registry for the Terminal hero (CONTEXT.md).
 *
 * Adding a Command is a one-line entry in COMMANDS. Hidden commands are
 * supported via `hidden: true`; they execute but are excluded from `help`
 * and tab completion. Easter-egg Hidden commands live below; the `ask`
 * Command lands in #05; `resume` lands in #08.
 */

export type CommandLine =
  | { kind: "echo"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string }
  | { kind: "image"; src: string; alt: string; className?: string };

export type CommandResult = {
  /** Lines to append immediately after the echo. */
  lines?: CommandLine[];
  /** Lines to append after a delay (in ms). Useful for animations. */
  delayedLines?: { delayMs: number; lines: CommandLine[] }[];
  /** Smooth-scroll target id. */
  scrollTo?: string;
  /** Wipe visible lines (history retained). */
  clear?: boolean;
};

export type CommandDef = {
  name: string;
  description: string;
  hidden?: boolean;
  run: (args: string[]) => CommandResult;
};

// ── Section commands ─────────────────────────────────────────────────────

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

// ── Built-in commands ────────────────────────────────────────────────────

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

// ── Hidden commands (#11) ────────────────────────────────────────────────

const COFFEE_QUIPS = [
  "Black, no sugar. Like my terminal.",
  "Sumatran today. Yesterday's was a regret.",
  "Currently brewing: hopes and dreams.",
  "Coffee is just a vehicle for the bean, really.",
];

const COFFEE_MUG = [
  "   ( (",
  "    ) )",
  "  ........",
  "  |      |]",
  "  \\      /",
  "   `----'",
].join("\n");

const sudoCommand: CommandDef = {
  name: "sudo",
  description: "elevated privileges (hidden)",
  hidden: true,
  run: () => ({
    lines: [
      {
        kind: "error",
        text: "Nice try. Permission denied for delusions of grandeur.",
      },
    ],
  }),
};

const danceCommand: CommandDef = {
  name: "dance",
  description: "(hidden)",
  hidden: true,
  run: () => ({
    lines: [
      {
        kind: "image",
        src: "/bitmoji-thats-all.png",
        alt: "Casey's bitmoji",
        className: "terminal-dance",
      },
      { kind: "output", text: "that's all, folks." },
    ],
  }),
};

const coffeeCommand: CommandDef = {
  name: "coffee",
  description: "(hidden)",
  hidden: true,
  run: () => ({
    lines: [
      { kind: "output", text: COFFEE_MUG },
      { kind: "output", text: randomFrom(COFFEE_QUIPS) },
    ],
  }),
};

const vimCommand: CommandDef = {
  name: "vim",
  description: "(hidden)",
  hidden: true,
  run: () => ({
    lines: [
      {
        kind: "output",
        text: "You'll be stuck here forever. Press :q to leave (just kidding — you can't).",
      },
    ],
    delayedLines: [
      {
        delayMs: 3000,
        lines: [{ kind: "output", text: "<Press any key to wake up>" }],
      },
    ],
  }),
};

const RM_TARGETS = [
  "/etc/passwd",
  "/etc/shadow",
  "/var/log/system.log",
  "/usr/bin/sudo",
  "/usr/local/bin/node",
  "/Applications/Slack.app",
  "/System/Library/CoreServices",
  "/Library/LaunchDaemons",
  "/private/tmp",
  "/Users/casey/.ssh/id_rsa",
  "/dev/null",
  "/Volumes/Macintosh HD",
];

const rmCommand: CommandDef = {
  name: "rm",
  description: "(hidden)",
  hidden: true,
  run: () => ({
    delayedLines: [
      ...RM_TARGETS.map((target, i) => ({
        delayMs: (i + 1) * 150,
        lines: [
          { kind: "output" as const, text: `rm: removing '${target}'` },
        ],
      })),
      {
        delayMs: (RM_TARGETS.length + 1) * 150 + 200,
        lines: [
          {
            kind: "output" as const,
            text: "just kidding — your filesystem is fine.",
          },
        ],
      },
    ],
  }),
};

// ── Registry ─────────────────────────────────────────────────────────────

export const COMMANDS: CommandDef[] = [
  ...sectionCommands,
  helpCommand,
  clearCommand,
  // hidden (#11)
  sudoCommand,
  danceCommand,
  coffeeCommand,
  vimCommand,
  rmCommand,
];

export function listedCommands(): CommandDef[] {
  return COMMANDS.filter((c) => !c.hidden);
}

export function findCommand(name: string): CommandDef | undefined {
  return COMMANDS.find((c) => c.name === name);
}

// ── Command-not-found messages (#11) ────────────────────────────────────

const NOT_FOUND_MESSAGES: ((name: string) => string)[] = [
  (name) => `command not found: ${name}`,
  (name) => `I don't speak \`${name}\`. Try \`help\`.`,
  (name) => `${name}: command not found. (try \`help\`, or just vibes.)`,
  (name) => `Hmm, never heard of \`${name}\`. \`help\` lists what I know.`,
  (name) => `\`${name}\`? bold choice. \`help\` for the boring options.`,
];

export function commandNotFoundMessage(name: string): string {
  return randomFrom(NOT_FOUND_MESSAGES)(name);
}

// ── Auto-demo (#03) ──────────────────────────────────────────────────────

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

// ── helpers ──────────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
