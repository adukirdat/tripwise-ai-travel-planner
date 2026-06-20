import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TripWise | Plan Smarter. Travel Better.",
  description:
    "TripWise is a modern travel planning platform for building, customizing, buying, and following trip itineraries."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
