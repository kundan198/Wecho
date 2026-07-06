import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Wecho is a boutique digital studio creating premium websites for ambitious brands and growing businesses.",
};

export default function About() {
  return <AboutPage />;
}
