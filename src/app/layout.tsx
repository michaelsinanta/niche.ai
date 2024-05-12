import type { Metadata } from "next";
import "./globals.css";
import { CustomNavbar } from "@/components/elements/Navbar";

export const metadata: Metadata = {
  title: "Quizyy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body>
          <CustomNavbar />
          {children}
        </body>
      </html>
  );
}
