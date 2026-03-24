import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fresh News - AI Research Machine",
  description:
    "Unbiased news research powered by your choice of AI. Inspired by Karpathy's auto-search.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
