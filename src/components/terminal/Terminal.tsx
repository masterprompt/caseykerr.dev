"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  AUTO_DEMO_COMMANDS,
  commandNotFoundMessage,
  findCommand,
  listedCommands,
  type CommandLine,
} from "./commands";

// Mobile / touch snapshot via useSyncExternalStore so we read the value
// during render (no setState in an effect) and stay SSR-safe. Resize is
// intentionally not subscribed to in #03 — flipping desktop/mobile mid-session
// is rare and would shuffle the UI in a confusing way during a Live REPL.
const noopSubscribe = () => () => {};
const getIsMobile = () =>
  window.innerWidth < 768 || navigator.maxTouchPoints > 0;
const getIsMobileServer = () => false;

/**
 * Terminal hero — CRT-styled CLI element at the top of the site.
 *
 * Two phases per CONTEXT.md:
 *   1. Auto-demo: typewriter sequence walking through AUTO_DEMO steps.
 *   2. Live REPL: keyboard-driven prompt (desktop only).
 *
 * Mobile (viewport < 768px OR navigator.maxTouchPoints > 0): auto-demo
 * plays, then a "tap to continue" cue replaces the input and scrolls
 * past the hero on tap.
 */

const PROMPT = "$ ";
const TYPE_MS = 70;
const POST_TYPE_PAUSE_MS = 150;
const INTER_STEP_PAUSE_MS = 300;

// Output typewriter (response lines). Fast enough that multi-line outputs
// (e.g. `help` listing ~10 commands) finish in ~1-2s, but still reads as typed.
const OUTPUT_TYPE_MS = 5;
const INTER_LINE_PAUSE_MS = 40;

export function Terminal() {
  const [phase, setPhase] = useState<"demo" | "live">("demo");
  const [demoText, setDemoText] = useState("");
  const [lines, setLines] = useState<CommandLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  // -1 means "drafting" (current input is whatever the user typed, not history).
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const isMobile = useSyncExternalStore(
    noopSubscribe,
    getIsMobile,
    getIsMobileServer,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLElement>(null);

  // Auto-scroll the terminal to the bottom whenever new output appears, so
  // the latest line + the input prompt stay visible like a real terminal.
  useLayoutEffect(() => {
    const el = terminalRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, demoText]);

  /**
   * Append response lines with a typewriter effect (one character at a time
   * per line, with a small pause between lines). Image lines render
   * instantly. Used by `executeCommand`; the `ask` command's async path
   * skips this because it has its own typewriter for the streamed answer.
   */
  const typewriteLines = useCallback(
    async (lines: CommandLine[]): Promise<void> => {
      for (const line of lines) {
        if (line.kind === "image") {
          setLines((prev) => [...prev, line]);
          continue;
        }
        const fullText = line.text;
        setLines((prev) => [...prev, { ...line, text: "" }]);
        for (let i = 1; i <= fullText.length; i++) {
          await sleep(OUTPUT_TYPE_MS);
          setLines((prev) => {
            if (prev.length === 0) return prev;
            const out = prev.slice();
            const last = out[out.length - 1];
            if (last && last.kind !== "image") {
              out[out.length - 1] = { ...line, text: fullText.slice(0, i) };
            }
            return out;
          });
        }
        if (INTER_LINE_PAUSE_MS > 0) {
          await sleep(INTER_LINE_PAUSE_MS);
        }
      }
    },
    [],
  );

  /**
   * Dispatch a command string through the registry. Used by both the live
   * REPL (`runCommand`) and the auto-demo, so what the demo shows is what
   * the visitor would get if they typed the same string. Response lines
   * type out via `typewriteLines`; the echo line is added instantly.
   */
  const executeCommand = useCallback(
    async (cmd: string): Promise<void> => {
      const [name, ...args] = cmd.split(/\s+/);
      const command = findCommand(name);

      // Echo the command immediately (the user / auto-demo already saw it typed).
      setLines((prev) => [...prev, { kind: "echo", text: cmd }]);

      if (!command) {
        await typewriteLines([
          { kind: "error", text: commandNotFoundMessage(name) },
        ]);
        return;
      }

      const result = command.run(args);

      if (result.clear) {
        setLines([]);
        return;
      }

      // For commands with an async continuation (e.g. `ask`), result.lines is
      // a placeholder the continuation will overwrite. Add instantly so its
      // own typewriter can take over without racing the universal one.
      if (result.async) {
        if (result.lines?.length) {
          setLines((prev) => [...prev, ...result.lines!]);
        }
      } else if (result.lines?.length) {
        await typewriteLines(result.lines);
      }

      // Schedule any delayed lines (e.g. vim's "wake up" message, rm's faux
      // deletion scroll). Each entry fires once after delayMs.
      if (result.delayedLines) {
        for (const { delayMs, lines: delayed } of result.delayedLines) {
          setTimeout(() => {
            setLines((prev) => [...prev, ...delayed]);
          }, delayMs);
        }
      }

      if (result.scrollTo) {
        document
          .getElementById(result.scrollTo)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Kick off async continuation if present (e.g. `ask` streaming an answer
      // back from the Worker). Fire-and-forget: the handler updates lines on
      // its own schedule via setLines.
      if (result.async) {
        void result.async(setLines);
      }
    },
    [typewriteLines],
  );

  // Auto-demo walks AUTO_DEMO_COMMANDS sequentially: type each command at the
  // typewriter cadence, then dispatch it through the real registry so the
  // demo's output matches what a visitor would see typing the same string.
  useEffect(() => {
    let cancelled = false;

    async function runAutoDemo() {
      for (const command of AUTO_DEMO_COMMANDS) {
        for (let i = 1; i <= command.length; i++) {
          if (cancelled) return;
          await sleep(TYPE_MS);
          setDemoText(command.slice(0, i));
        }
        if (cancelled) return;
        await sleep(POST_TYPE_PAUSE_MS);
        setDemoText("");
        await executeCommand(command);
        if (cancelled) return;
        await sleep(INTER_STEP_PAUSE_MS);
      }
      if (cancelled) return;
      setPhase("live");
    }

    runAutoDemo();
    return () => {
      cancelled = true;
    };
  }, [executeCommand]);

  // Focus the input as soon as we reach the Live REPL phase (desktop only).
  useEffect(() => {
    if (phase === "live" && !isMobile) inputRef.current?.focus();
  }, [phase, isMobile]);

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) {
      // Pressing Enter on an empty prompt still echoes a fresh prompt line.
      setLines((prev) => [...prev, { kind: "echo", text: "" }]);
      return;
    }

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setDraft("");

    void executeCommand(cmd);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const matches = listedCommands().filter((c) =>
        c.name.startsWith(input.trim()),
      );
      if (matches.length === 1) {
        setInput(matches[0].name);
      } else if (matches.length > 1) {
        // Print the candidate list inline, like a real shell does on
        // a second Tab. Single-Tab list keeps things terse here.
        setLines((prev) => [
          ...prev,
          { kind: "echo", text: input },
          { kind: "output", text: matches.map((m) => m.name).join("  ") },
        ]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === -1) setDraft(input);
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setInput(history[history.length - 1 - nextIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInput(
        nextIndex === -1 ? draft : history[history.length - 1 - nextIndex],
      );
      return;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runCommand(input);
    setInput("");
  }

  function handleMobileContinue() {
    document
      .getElementById("about")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      ref={terminalRef}
      className="terminal"
      onClick={() => {
        if (!isMobile) inputRef.current?.focus();
      }}
      aria-label="Terminal hero"
    >
      {lines.map((line, i) => {
        if (line.kind === "image") {
          return (
            <div key={i} className="terminal-line">
              {/* eslint-disable-next-line @next/next/no-img-element --
                  next/image would be ceremony here: tiny easter-egg PNG,
                  below the fold, images.unoptimized: true is already set
                  (static export). Plain <img> keeps the in-flow layout
                  predictable inside the terminal. */}
              <img
                src={line.src}
                alt={line.alt}
                className={line.className}
              />
            </div>
          );
        }
        return (
          <div
            key={i}
            className={
              line.kind === "error"
                ? "terminal-line terminal-line--error"
                : "terminal-line"
            }
          >
            {line.kind === "echo" && (
              <span className="terminal-prompt">{PROMPT}</span>
            )}
            {line.text}
          </div>
        );
      })}

      {phase === "demo" && (
        <div className="terminal-line">
          <span className="terminal-prompt">{PROMPT}</span>
          <span>{demoText}</span>
          <span className="terminal-cursor" aria-hidden />
        </div>
      )}

      {phase === "live" && !isMobile && (
        <form
          onSubmit={handleSubmit}
          className="terminal-line terminal-input-line"
        >
          <span className="terminal-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Terminal input"
          />
        </form>
      )}

      {phase === "live" && isMobile && (
        <button
          type="button"
          onClick={handleMobileContinue}
          className="terminal-mobile-continue"
        >
          tap to continue ↓
        </button>
      )}
    </section>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
