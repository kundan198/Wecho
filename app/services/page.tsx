import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website design, UI/UX, development, 3D & motion, branding, SEO, performance, and maintenance — everything your digital presence needs.",
};

export default function Services() {
  return <ServicesPage />;
}
