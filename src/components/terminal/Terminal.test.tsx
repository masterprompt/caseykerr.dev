import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, fireEvent, within } from "@testing-library/react";
import { Terminal } from "./Terminal";

/**
 * Push through the auto-demo. The typewriter and inter-step pauses use
 * `setTimeout`, so fake timers + `advanceTimersByTimeAsync` collapse the
 * full demo (which is ~2-3 simulated seconds) into a few microtasks.
 */
async function reachLivePhase() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(10_000);
  });
}

function getInput() {
  return screen.getByLabelText(/terminal input/i) as HTMLInputElement;
}

async function submitCommand(cmd: string) {
  const input = getInput();
  await act(async () => {
    fireEvent.change(input, { target: { value: cmd } });
    fireEvent.submit(input.closest("form")!);
    await vi.advanceTimersByTimeAsync(10_000);
  });
}

describe("Terminal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the prompt immediately", () => {
    render(<Terminal />);
    expect(screen.getAllByText("$").length).toBeGreaterThan(0);
  });

  it("auto-demo eventually transitions to live phase (input appears)", async () => {
    render(<Terminal />);
    expect(screen.queryByLabelText(/terminal input/i)).toBeNull();
    await reachLivePhase();
    expect(getInput()).toBeInTheDocument();
  });

  it("submitting a command echoes it and dispatches through the registry", async () => {
    render(<Terminal />);
    await reachLivePhase();
    // The demo already ran `whoami` once; submitting it again should produce
    // a second copy of its output line. Two copies = the live submit dispatched.
    await submitCommand("whoami");
    expect(
      screen.getAllByText(/casey kerr · senior full-stack & ai engineer/i),
    ).toHaveLength(2);
  });

  it("ArrowUp recalls the most recent command; ArrowDown returns to draft", async () => {
    render(<Terminal />);
    await reachLivePhase();
    await submitCommand("whoami");

    const input = getInput();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("whoami");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.value).toBe("");
  });

  it("Tab with a single matching prefix autocompletes the command", async () => {
    render(<Terminal />);
    await reachLivePhase();
    const input = getInput();
    fireEvent.change(input, { target: { value: "who" } });
    fireEvent.keyDown(input, { key: "Tab" });
    expect(input.value).toBe("whoami");
  });

  it("Tab with multiple matches prints the candidates inline", async () => {
    render(<Terminal />);
    await reachLivePhase();
    const input = getInput();
    // "c" matches both `contact` and `clear`.
    fireEvent.change(input, { target: { value: "c" } });
    fireEvent.keyDown(input, { key: "Tab" });
    // The candidate list line should now exist (containing both names).
    expect(screen.getByText(/contact.*clear|clear.*contact/i)).toBeInTheDocument();
  });

  it("the `clear` command empties the visible lines", async () => {
    render(<Terminal />);
    await reachLivePhase();
    // Demo output should be on screen at this point.
    expect(screen.getByText(/casey kerr/i)).toBeInTheDocument();

    await submitCommand("clear");

    expect(screen.queryByText(/casey kerr/i)).toBeNull();
  });

  it("clicking a help-row dispatches the corresponding command", async () => {
    render(<Terminal />);
    await reachLivePhase();
    // The auto-demo runs `help` last, so help-rows are already on screen.
    // Pick `clear` since its effect is observable (lines disappear).
    expect(screen.getByText(/casey kerr/i)).toBeInTheDocument();

    const clearRow = screen
      .getAllByRole("button")
      .find((b) => within(b).queryByText("clear")) as HTMLButtonElement;
    expect(clearRow).toBeDefined();

    await act(async () => {
      fireEvent.click(clearRow);
      await vi.advanceTimersByTimeAsync(10_000);
    });

    expect(screen.queryByText(/casey kerr/i)).toBeNull();
  });

  it("clicking a command-list item dispatches the section command", async () => {
    const scrollSpy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});
    // Stub getElementById so section commands resolve a target.
    const fakeEl = document.createElement("div");
    const getSpy = vi
      .spyOn(document, "getElementById")
      .mockReturnValue(fakeEl);

    render(<Terminal />);
    await reachLivePhase();
    // `ls` ran during the demo; one of its buttons is `about`.
    const aboutButton = screen.getByRole("button", { name: "about" });
    await act(async () => {
      fireEvent.click(aboutButton);
      await vi.advanceTimersByTimeAsync(1_000);
    });

    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();
    getSpy.mockRestore();
  });

  it("idle cursor is visible when the input is empty", async () => {
    const { container } = render(<Terminal />);
    await reachLivePhase();
    expect(container.querySelector(".terminal-cursor--idle")).not.toBeNull();
  });

  it("idle cursor is removed once the user types", async () => {
    const { container } = render(<Terminal />);
    await reachLivePhase();
    fireEvent.change(getInput(), { target: { value: "x" } });
    expect(container.querySelector(".terminal-cursor--idle")).toBeNull();
  });
});
