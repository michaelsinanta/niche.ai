import type { Metadata } from "next";
import "./globals.css";
import { CustomNavbar } from "@/components/elements/Navbar";
import { AuthContextProvider } from "@/components/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "niche.ai",
  description: "Find your niche",
  icons: {
    icon: [
      {
        url: "/assets/logo.png",
        href: "/assets/logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body>
          <CustomNavbar />
          {children}
        </body>
      </html>
    </AuthContextProvider>
  );
}
