import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Workbench — Algorithm & Data Structure Visualizer",
  description:
    "TypeScript + React + Next.js Data Structures and Algorithms Visualizer styled with Tweakcn & shadcn/ui CSS tokens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="claude">
      <body className="bg-background text-foreground antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
