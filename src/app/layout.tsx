import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { ConsoleEgg } from "@/components/eggs/ConsoleEgg";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casey Kerr · Senior Full-Stack & AI Engineer",
  description: "Complexity embedded in simplicity.",
  icons: {
    icon: "/kerrsoft-logo.png",
    apple: "/kerrsoft-logo.png",
  },
};

// View-source easter egg (#09). JSX can't render real HTML comments, so we
// deliver this as an inert <script type="application/x-source-art"> tag;
// browser ignores the unknown script type, but view-source shows the ASCII
// art and credits clean and legible right up at the top of <head>.
const SOURCE_ART = `

  ██╗  ██╗███████╗██████╗ ██████╗ ███████╗ ██████╗ ███████╗████████╗
  ██║ ██╔╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔═══██╗██╔════╝╚══██╔══╝
  █████╔╝ █████╗  ██████╔╝██████╔╝███████╗██║   ██║█████╗     ██║
  ██╔═██╗ ██╔══╝  ██╔══██╗██╔══██╗╚════██║██║   ██║██╔══╝     ██║
  ██║  ██╗███████╗██║  ██║██║  ██║███████║╚██████╔╝██║        ██║
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝        ╚═╝

  hand-crafted in Waukesha, Wisconsin, by Casey Kerr.

  built with: Next.js 16 (static export), React 19, TypeScript,
              Tailwind CSS v4, GitHub Pages, AWS Route 53.

  with deference to:
    - RFC 2324 (HTCPCP/1.0) ............ see /teapot (landing with #10)
    - RFC 9116 (security.txt) .......... see /.well-known/security.txt
    - humanstxt.org .................... see /humans.txt

  if you're reading this, you're my kind of nerd. say hi:
  me@caseykerr.com

  (this page is also a terminal. try typing 'help' in the box up top,
   or 'help()' in this console.)

`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/x-source-art"
          dangerouslySetInnerHTML={{ __html: SOURCE_ART }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConsoleEgg />
        {children}
        {/* GoatCounter pageview tracking (#13). No cookies, no fingerprinting;
            counts page hits and basic referrer data only. Loaded after
            hydration so it doesn't block first paint. */}
        <Script
          data-goatcounter="https://masterprompt.goatcounter.com/count"
          src="https://gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
