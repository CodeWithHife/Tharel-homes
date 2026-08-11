import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import AdminSeeder from "@/components/AdminSeeder";
import SmoothScroll from "@/components/SmoothScroll";
import BottomNav from "@/components/BottomNav";
import Script from "next/script";

export const viewport = {
  themeColor: "#0F172A",
};

export const metadata = {
  title: "The 10th Homes & Apartments",
  description: "Nigeria's trusted real estate platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tharel Homes",
  },
  icons: {
    icon: "/images/logos/logo.png",
    apple: "/images/logos/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
        <AdminSeeder />
        <SmoothScroll>
          <NavbarWrapper />
          {children}
          <FooterWrapper />
          <BottomNav />
        </SmoothScroll>
      </body>
    </html>
  );
}