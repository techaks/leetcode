import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0b] text-white">
        <Navbar />
        {children}
         <Toaster position="top-right" />
      </body>
    </html>
  );
}