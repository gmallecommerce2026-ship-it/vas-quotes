import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientProviders } from "@/context/ClientProviders"; 
import MobileLayout from "@/components/layout/mobile-layout";
import "./globals.css";
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VAS Lighting Home",
  description: "Benefits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientProviders>
          <MobileLayout>
            {children}
          </MobileLayout>
        </ClientProviders>
      </body>
    </html>
  );
}