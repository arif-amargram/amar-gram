import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "আমার গ্রাম | Amar Gram",
  description: "নিজের গ্রামের তথ্য, পরিচিতি ও স্থানীয় ব্যবসার একটি নির্ভরযোগ্য ঠিকানা।"
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
