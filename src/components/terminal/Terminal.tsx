"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Terminal hero — CRT-styled CLI element at the top of the site.
 *
 * Two phases per CONTEXT.md:
 *   1. Auto-demo: typewriter sequence on page load (one command in this slice).
 *   2. Live REPL: keyboard-driven prompt accepting Commands (one in this slice).
 *
 * Out of scope for #02 (arrives in #03):
 *   - Tab completion, command history, `help`, `clear`
 *   - Full auto-demo sequence (whoami → ls projects/ → help)
 *   - Mobile auto-demo-only behavior
 */

type Line =
  | { kind: "echo"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string };

const PROMPT = "$ ";
const DEMO_COMMAND = "whoami";
const DEMO_RESPONSE = "Casey Kerr — senior full-stack engineer";

export function Terminal() {
  const [phase, setPhase] = useState<"demo" | "live">("demo");
  const [demoText, setDemoText] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-demo: type DEMO_COMMAND character-by-character, then commit the
  // command and its response to history before handing off to the Live REPL.
  // ~80ms per char × 6 chars ≈ 480ms; close to the 600ms target in #02 AC.
  useEffect(() => {
    let i = 0;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      i += 1;
      setDemoText(DEMO_COMMAND.slice(0, i));
      if (i >= DEMO_COMMAND.length) {
        clearInterval(interval);
        finishTimer = setTimeout(() => {
          setLines([
            { kind: "echo", text: DEMO_COMMAND },
            { kind: "output", text: DEMO_RESPONSE },
          ]);
          setDemoText("");
          setPhase("live");
        }, 250);
      }
    }, 80);
    return () => {
      clearInterval(interval);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, []);

  // Focus the input as soon as we enter the live phase.
  useEffect(() => {
    if (phase === "live") inputRef.current?.focus();
  }, [phase]);

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;

    const echo: Line = { kind: "echo", text: cmd };

    if (cmd === "about") {
      setLines((prev) => [...prev, echo]);
      document
        .getElementById("about")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setLines((prev) => [
      ...prev,
      echo,
      { kind: "error", text: `command not found: ${cmd}` },
    ]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runCommand(input);
    setInput("");
  }

  return (
    <section
      className="terminal"
      onClick={() => inputRef.current?.focus()}
      aria-label="Terminal hero"
    >
      {phase === "demo" && (
        <div className="terminal-line">
          <span className="terminal-prompt">{PROMPT}</span>
          <span>{demoText}</span>
          <span className="terminal-cursor" aria-hidden />
        </div>
      )}

      {phase === "live" && (
        <>
          {lines.map((line, i) => (
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
          ))}
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
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal input"
            />
          </form>
        </>
      )}
    </section>
  );
}
