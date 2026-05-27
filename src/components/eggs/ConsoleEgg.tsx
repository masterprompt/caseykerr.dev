"use client";

import { useEffect } from "react";

/**
 * ConsoleEgg — renders nothing; runs once on mount.
 *
 * Prints a styled banner to devtools and registers `window.help` and the
 * `window.casey` namespace so a curious visitor poking at the console gets
 * rewarded.
 *
 * Career / skills data is hand-stubbed here for now; #04 swaps this for
 * reads from content/resume.json once the resumatic sync ships.
 */

declare global {
  interface Window {
    help?: () => void;
    casey?: {
      career: () => void;
      skills: () => void;
      contact: () => void;
      eggs: () => void;
    };
  }
}

// ── ASCII art for the load banner ───────────────────────────────────────

const KERRSOFT_BANNER = `
██╗  ██╗███████╗██████╗ ██████╗ ███████╗ ██████╗ ███████╗████████╗
██║ ██╔╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔═══██╗██╔════╝╚══██╔══╝
█████╔╝ █████╗  ██████╔╝██████╔╝███████╗██║   ██║█████╗     ██║
██╔═██╗ ██╔══╝  ██╔══██╗██╔══██╗╚════██║██║   ██║██╔══╝     ██║
██║  ██╗███████╗██║  ██║██║  ██║███████║╚██████╔╝██║        ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝        ╚═╝`;

// ── Console styles (matching the CRT theme) ─────────────────────────────

const GREEN = "color: #39ff14; font-family: ui-monospace, monospace;";
const AMBER = "color: #ffb000;";
const AMBER_BOLD = "color: #ffb000; font-weight: bold;";

// ── window.help / window.casey implementations ──────────────────────────

function help() {
  console.log(
    `%chelp()\n%c─────────────────────────────────────────\n` +
      `%cAvailable console commands:\n\n` +
      `  %ccasey.career()%c   — Casey's career timeline\n` +
      `  %ccasey.skills()%c   — tech stack & languages\n` +
      `  %ccasey.contact()%c  — email, GitHub, LinkedIn\n` +
      `  %ccasey.eggs()%c     — where the easter eggs hide\n\n` +
      `%cTry one!`,
    AMBER_BOLD,
    AMBER,
    GREEN,
    AMBER_BOLD,
    GREEN,
    AMBER_BOLD,
    GREEN,
    AMBER_BOLD,
    GREEN,
    AMBER_BOLD,
    GREEN,
    AMBER,
  );
}

function career() {
  console.group("%cCasey Kerr — career", AMBER_BOLD);
  console.table([
    {
      role: "Founder & Engineer",
      org: "Kerrsoft LLC",
      since: 2018,
    },
    {
      role: "Chairman & Executive Director",
      org: "Waukesha Makerspace (501c3)",
      since: 2019,
    },
    {
      role: "Senior Full-Stack Engineer",
      org: "Sollis Health",
      stack: "React Native / Node / Next / Azure",
    },
    {
      role: "Senior Software Engineer",
      org: "Snapsheet Inc.",
      stack: "React / Node",
    },
    {
      role: "Senior React Developer",
      org: "Experian Automotive",
      stack: "React",
    },
    {
      role: "Senior Software Engineer",
      org: "Northwestern Mutual",
      stack: "React / AWS Lambda / Alexa Skills",
    },
    {
      role: "Manufacturing Support Analyst",
      org: "Signicast Corporation",
      stack: "PLC (RSLogix / Fanuc)",
    },
  ]);
  console.log(
    "%c(full timeline + 6 earlier roles on the site once #04 lands)",
    AMBER,
  );
  console.groupEnd();
}

function skills() {
  console.group("%cTech stack", AMBER_BOLD);
  console.log("%cFront", AMBER_BOLD, " React 19, Next.js 16, TypeScript, Tailwind v4");
  console.log("%cBack ", AMBER_BOLD, " Node.js, Express, AWS Lambda, ASP.NET");
  console.log("%cCloud", AMBER_BOLD, " AWS (Lambda, DynamoDB, S3, API Gateway, CloudFormation), Cloudflare Workers, Azure (moderate)");
  console.log("%cData ", AMBER_BOLD, " PostgreSQL, MySQL, MongoDB, DynamoDB, Redis, ElasticSearch");
  console.log("%cAI   ", AMBER_BOLD, " LLM integration, prompt engineering, agentic systems");
  console.log("%cOps  ", AMBER_BOLD, " Docker, Kubernetes, GitHub Actions, Jenkins");
  console.log("%cGame ", AMBER_BOLD, " Unity, Unreal, Blitz3D");
  console.log("%cThen ", AMBER_BOLD, " C#, Java, PHP, Perl, Go, Python, Ruby, Objective-C, PLC ladder logic");
  console.groupEnd();
}

function contact() {
  console.group("%cContact", AMBER_BOLD);
  console.log("Email      me@caseykerr.com");
  console.log("GitHub     github.com/masterprompt");
  console.log("LinkedIn   linkedin.com/in/caseykerr");
  console.log("Site       https://caseykerr.dev");
  console.groupEnd();
}

function eggs() {
  console.group("%cEaster eggs scattered across:", AMBER_BOLD);
  console.log("• This console (you found it).");
  console.log("• View-source on the home page (look near the top of <head>).");
  console.log("• /humans.txt");
  console.log("• /.well-known/security.txt");
  console.log("• The terminal hero — try typing things that shouldn't exist.");
  console.log("• Network responses (curl is your friend) — landing with #05 / #10.");
  console.groupEnd();
}

// ── Component ───────────────────────────────────────────────────────────

export function ConsoleEgg() {
  useEffect(() => {
    console.log(
      `%c${KERRSOFT_BANNER}%c\n\n` +
        `Looking under the hood? Try typing %chelp()%c in the console.\n` +
        `Or any of the %ccasey.*()%c methods.\n`,
      GREEN + " font-weight: bold; line-height: 1.15;",
      AMBER,
      AMBER_BOLD,
      AMBER,
      AMBER_BOLD,
      AMBER,
    );

    window.help = help;
    window.casey = { career, skills, contact, eggs };

    return () => {
      delete window.help;
      delete window.casey;
    };
  }, []);

  return null;
}
