"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  AUTO_DEMO,
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

  // Auto-demo walks AUTO_DEMO sequentially: type each Command, pause,
  // commit echo + response to lines, pause, advance. Then hand off to
  // the Live REPL.
  useEffect(() => {
    let cancelled = false;

    async function runAutoDemo() {
      for (const step of AUTO_DEMO) {
        for (let i = 1; i <= step.command.length; i++) {
          if (cancelled) return;
          await sleep(TYPE_MS);
          setDemoText(step.command.slice(0, i));
        }
        if (cancelled) return;
        await sleep(POST_TYPE_PAUSE_MS);
        setLines((prev) => [
          ...prev,
          { kind: "echo", text: step.command },
          ...step.response(),
        ]);
        setDemoText("");
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
  }, []);

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

    const [name, ...args] = cmd.split(/\s+/);
    const command = findCommand(name);

    if (!command) {
      setLines((prev) => [
        ...prev,
        { kind: "echo", text: cmd },
        { kind: "error", text: commandNotFoundMessage(name) },
      ]);
      return;
    }

    const result = command.run(args);

    if (result.clear) {
      setLines([]);
      return;
    }

    setLines((prev) => [
      ...prev,
      { kind: "echo", text: cmd },
      ...(result.lines ?? []),
    ]);

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
