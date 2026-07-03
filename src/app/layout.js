import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}