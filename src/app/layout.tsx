import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";
import MicrosoftClarity from "@/components/shared/microsoft-clarity";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <MicrosoftClarity />
      </body>
    </html>
  );
}
