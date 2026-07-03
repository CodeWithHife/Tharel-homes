import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import AdminSeeder from "@/components/AdminSeeder";

export const metadata = {
  title: "The 10th Homes & Apartments",
  description: "Nigeria's trusted real estate platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminSeeder />
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}