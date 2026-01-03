import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlateAndGrape - Your Pocket Sommelier",
  description: "Snap photos of the menu and wine list, get instant food + wine pairing recommendations optimised for taste and value.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
