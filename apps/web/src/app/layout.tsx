import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koli Parts",
  description: "Търсене на авточасти с прозрачен произход и проверка на съвместимостта.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
