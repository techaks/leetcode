import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

export const metadata = {
  title: "CodeJudge",
  description: "Practice coding like LeetCode",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0b] text-white">
        <Providers>
          <Navbar />    
          {children}
        </Providers>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}