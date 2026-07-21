import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import SecurityGuard from "@/components/SecurityGuard";

export const metadata: Metadata = {
  title: "Vinpearl Invest - Nền tảng đầu tư nghỉ dưỡng",
  description: "Đầu tư thông minh vào các dự án nghỉ dưỡng Vinpearl cao cấp - Lợi nhuận hấp dẫn, bảo vệ vốn toàn phần",
  keywords: "Vinpearl, đầu tư, nghỉ dưỡng, resort, Vingroup, lợi nhuận",
  icons: {
    icon: "/logo.png?v=2",
    shortcut: "/logo.png?v=2",
    apple: "/logo.png?v=2",
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
        <link rel="icon" type="image/png" href="/logo.png?v=2" />
        <link rel="shortcut icon" href="/logo.png?v=2" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
      </head>
      <body>
        <SecurityGuard />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
