"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  // Hide on dashboard and auth pages
  if (pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/signup") {
    return null;
  }
  return <Footer />;
}