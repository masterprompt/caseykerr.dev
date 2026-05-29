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

const SITE_URL = "https://caseykerr.dev";
const SITE_DESCRIPTION =
  "Casey Kerr is a senior full-stack and AI engineer in Waukesha, Wisconsin, and founder of Kerrsoft. React, Node, AWS, and AI integration work for enterprise consulting clients.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Casey Kerr · Senior Full-Stack & AI Engineer · Kerrsoft",
    template: "%s · Casey Kerr",
  },
  description: SITE_DESCRIPTION,
  applicationName: "caseykerr.dev",
  authors: [{ name: "Casey Kerr", url: SITE_URL }],
  creator: "Casey Kerr",
  publisher: "Casey Kerr",
  keywords: [
    "Casey Kerr",
    "Kerrsoft",
    "senior full-stack engineer",
    "AI engineer",
    "React",
    "Node.js",
    "AWS",
    "Waukesha",
    "Wisconsin",
    "consulting",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "caseykerr.dev",
    title: "Casey Kerr · Senior Full-Stack & AI Engineer · Kerrsoft",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/kerrsoft-logo.png",
        width: 512,
        height: 512,
        alt: "Kerrsoft logo",
      },
    ],
    firstName: "Casey",
    lastName: "Kerr",
    username: "masterprompt",
  },
  twitter: {
    // `summary` (small square thumbnail) until a proper 1200×630 OG image
    // ships; the existing kerrsoft-logo is square and crops poorly in
    // `summary_large_image` cards.
    card: "summary",
    title: "Casey Kerr · Senior Full-Stack & AI Engineer · Kerrsoft",
    description: SITE_DESCRIPTION,
    creator: "@Casey_Kerr",
    images: ["/kerrsoft-logo.png"],
  },
  icons: {
    icon: "/kerrsoft-logo.png",
    apple: "/kerrsoft-logo.png",
  },
};

// schema.org Person, JSON-LD. Lives in <head> so Google can use it to
// consolidate identity (caseykerr.dev → LinkedIn, GitHub, X, Kerrsoft,
// Waukesha Makerspace) into a single knowledge-graph entity. `sameAs`
// is the load-bearing field here.
const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#casey-kerr`,
  name: "Casey Kerr",
  alternateName: "masterprompt",
  url: SITE_URL,
  image: `${SITE_URL}/kerrsoft-logo.png`,
  jobTitle: "Senior Full-Stack & AI Engineer",
  description: SITE_DESCRIPTION,
  email: "mailto:me@caseykerr.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Waukesha",
    addressRegion: "WI",
    addressCountry: "US",
  },
  worksFor: {
    "@type": "Organization",
    name: "Kerrsoft",
  },
  sameAs: [
    "https://linkedin.com/in/caseykerr",
    "https://github.com/masterprompt",
    "https://twitter.com/Casey_Kerr",
    "https://caseykerr.com",
    "https://waukeshamakerspace.org",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
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
