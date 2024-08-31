import type { Metadata } from "next";
import "./globals.css";
import { CustomNavbar } from "@/components/elements/Navbar";
import { AuthContextProvider } from "@/components/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "niche.ai",
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
