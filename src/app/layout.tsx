import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import SecurityGuard from "@/components/SecurityGuard";

export const metadata: Metadata = {
  title: "QUỸ HUY ĐỘNG VỐN TẬP ĐOÀN VINGROUP",
  description: "Hệ thống đầu tư thông minh và hiệu quả - Quỹ huy động vốn Tập đoàn Vingroup, bảo vệ vốn toàn phần",
  keywords: "Vingroup, Quỹ huy động vốn, đầu tư, Vingroup QPL, lợi nhuận",
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
