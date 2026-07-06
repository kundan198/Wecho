import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project — we reply within one business day with ideas, a timeline, and a clear quote.",
};

export default function Contact() {
  return <ContactPage />;
}
