import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NotionLike",
  description: "A Notion-inspired workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}