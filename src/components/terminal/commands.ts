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
  | { kind: "image"; src: string; alt: string; className?: string }
  | { kind: "help-row"; commandName: string; description: string }
  | { kind: "command-list"; commandNames: string[] };

export type AsyncCommandUpdater = (
  fn: (prev: CommandLine[]) => CommandLine[],
) => void;

export type CommandResult = {
  /** Lines to append immediately after the echo. */
  lines?: CommandLine[];
  /** Lines to append after a delay (in ms). Useful for animations. */
  delayedLines?: { delayMs: number; lines: CommandLine[] }[];
  /** Smooth-scroll target id. */
  scrollTo?: string;
  /** Wipe visible lines (history retained). */
  clear?: boolean;
  /**
   * Optional async continuation. Sync `lines` are committed first, then this
   * runs and can update lines progressively via the updater. Used by `ask`
   * (network request + typewriter on the answer).
   */
  async?: (updater: AsyncCommandUpdater) => Promise<void>;
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

// ── Info commands ────────────────────────────────────────────────────────

const whoamiCommand: CommandDef = {
  name: "whoami",
  description: "About Casey in one line",
  run: () => ({
    lines: [
      {
        kind: "output",
        text: "Casey Kerr · senior full-stack & AI engineer · Kerrsoft, Waukesha Makerspace",
      },
    ],
  }),
};

const lsCommand: CommandDef = {
  name: "ls",
  description: "List site sections",
  run: () => ({
    lines: [
      {
        kind: "command-list",
        commandNames: SECTIONS.map((s) => s.id),
      },
    ],
  }),
};

// ── Built-in commands ────────────────────────────────────────────────────

const helpCommand: CommandDef = {
  name: "help",
  description: "List available commands",
  run: () => ({
    lines: [
      { kind: "output", text: "Available commands:" },
      ...listedCommands().map((c) => ({
        kind: "help-row" as const,
        commandName: c.name,
        description: c.description,
      })),
    ],
  }),
};

const clearCommand: CommandDef = {
  name: "clear",
  description: "Clear the terminal output",
  run: () => ({ clear: true }),
};

// ── `ask` command (#05) ──────────────────────────────────────────────────

const ASK_WORKER_URL =
  process.env.NEXT_PUBLIC_ASK_WORKER_URL ??
  "https://caseykerr-dev-worker.caseykerr.workers.dev";

const ASK_TYPEWRITER_MS = 12;
const ASK_PENDING_TEXT = "…";

const askCommand: CommandDef = {
  name: "ask",
  description: "Ask the AI assistant about Casey (e.g. `ask what aws experience do you have`)",
  run: (args) => {
    const question = args.join(" ").trim();
    if (!question) {
      return {
        lines: [
          {
            kind: "error",
            text: "usage: ask <your question>   e.g. ask what's your favorite stack",
          },
        ],
      };
    }

    return {
      // Emit a placeholder line synchronously; the async continuation will
      // replace its contents as the answer streams in (typewriter style).
      lines: [{ kind: "output", text: ASK_PENDING_TEXT }],
      async: async (updater) => {
        let answer: string;
        let isError = false;
        let quota: { used: number; limit: number } | undefined;

        try {
          const res = await fetch(`${ASK_WORKER_URL}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
          });
          const data = (await res.json()) as {
            answer?: string;
            error?: string;
            quota?: { used: number; limit: number; remaining: number };
          };
          quota = data.quota;
          if (data.answer) {
            answer = data.answer;
          } else {
            answer = `error: ${data.error ?? "unknown response shape"}`;
            isError = true;
          }
        } catch {
          answer =
            "Couldn't reach the AI. Could be a network blip; try again, or email me at me@caseykerr.com.";
          isError = true;
        }

        // Reset the placeholder to empty so the typewriter starts clean.
        const kind: CommandLine["kind"] = isError ? "error" : "output";
        updater((prev) => replaceLastWith(prev, { kind, text: "" }));

        // Typewriter the answer in, one character at a time.
        for (let i = 1; i <= answer.length; i++) {
          await sleep(ASK_TYPEWRITER_MS);
          updater((prev) =>
            replaceLastWith(prev, { kind, text: answer.slice(0, i) }),
          );
        }

        // Show daily-question usage from the worker (per-IP cap).
        if (quota) {
          updater((prev) => [
            ...prev,
            {
              kind: "output",
              text: `(${quota.used}/${quota.limit} daily questions used)`,
            },
          ]);
        }
      },
    };
  },
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
  askCommand,
  whoamiCommand,
  lsCommand,
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
 * Commands the auto-demo types out on page load. Each one is dispatched
 * through the real command registry (see Terminal.tsx), so a visitor
 * typing any of these strings gets the same output the demo just showed.
 * No fake responses, no commands that exist only in the demo.
 */
export const AUTO_DEMO_COMMANDS: string[] = ["whoami", "ls", "help"];

// ── helpers ──────────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function replaceLastWith(
  prev: CommandLine[],
  next: CommandLine,
): CommandLine[] {
  if (prev.length === 0) return prev;
  const out = prev.slice();
  out[out.length - 1] = next;
  return out;
}
