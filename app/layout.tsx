import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans, Caveat, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { Nav, Footer, CursorGlow, ThemeToggle, ChatButton } from "@/components/chrome";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "wecho — Creative Websites",
    template: "%s — wecho",
  },
  description:
    "wecho is a boutique digital studio creating premium websites for ambitious brands and growing businesses. We design. We build. We echo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jakarta.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <SmoothScroll>
          <SceneRoot />
          <CursorGlow />
          <Nav />
          {children}
          <Footer />
          <ThemeToggle />
          <ChatButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
