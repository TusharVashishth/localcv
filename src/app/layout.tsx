import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthSessionProvider } from "@/components/shared/auth-session-provider";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";
import MicrosoftClarity from "@/components/shared/microsoft-clarity";
import PwaServiceWorker from "@/components/shared/pwa/pwa-service-worker";
import PwaSplashScreen from "@/components/shared/pwa/pwa-splash-screen";
import PwaInstallPrompt from "@/components/shared/pwa/pwa-install-prompt";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

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
        <PwaSplashScreen />
        <AuthSessionProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthSessionProvider>
        <PwaServiceWorker />
        <PwaInstallPrompt />
        <MicrosoftClarity />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
