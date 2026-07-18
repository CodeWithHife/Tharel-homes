import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import AdminSeeder from "@/components/AdminSeeder";
import Script from "next/script";

export const metadata = {
  title: "The 10th Homes & Apartments",
  description: "Nigeria's trusted real estate platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AdminSeeder />
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}