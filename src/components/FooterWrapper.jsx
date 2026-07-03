"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  // Hide on all dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  return <Footer />;
}