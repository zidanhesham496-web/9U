import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "9U | منصة تسجيل المواهب",
  description: "منصة 9U لتسجيل المواهب المسرحية.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}