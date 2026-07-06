import type { Metadata } from "next";
import { WorkPage } from "@/components/pages/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Featured projects from wecho — premium websites for interior design, healthcare, construction, and ambitious businesses everywhere.",
};

export default function Work() {
  return <WorkPage />;
}
