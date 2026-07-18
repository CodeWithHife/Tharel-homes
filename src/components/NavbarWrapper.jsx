"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
  }, []);

  // Hide on all dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  return <Navbar />;
}