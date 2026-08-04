"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  // Hide on dashboard, auth, and selected public pages
  if (
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/properties" ||
    pathname === "/contact"
  ) {
    return null;
  }
  return <Footer />;
}