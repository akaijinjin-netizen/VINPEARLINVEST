import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import SecurityGuard from "@/components/SecurityGuard";

export const metadata: Metadata = {
  title: "Vingroup QPL - Nền tảng đầu tư nghỉ dưỡng",
  description: "Đầu tư thông minh vào các dự án nghỉ dưỡng Vingroup QPL cao cấp - Lợi nhuận hấp dẫn, bảo vệ vốn toàn phần",
  keywords: "Vingroup QPL, đầu tư, nghỉ dưỡng, resort, Vingroup, lợi nhuận",
  icons: {
    icon: "/favicon.ico?v=5",
    shortcut: "/favicon.ico?v=5",
    apple: "/favicon.ico?v=5",
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico?v=5" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=5" />
      </head>
      <body>
        <SecurityGuard />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
