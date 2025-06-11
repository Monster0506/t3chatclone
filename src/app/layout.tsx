import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from '@/components/Auth/SupabaseProvider';
import AppLayout from '@/components/Layout/AppLayout';
import { ThemeProvider } from '@/theme/ThemeProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T3 Chat Clone",
  description: "A clone of the T3 Chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <SupabaseProvider>
            <ThemeProvider>
            <AppLayout>
              {children}
            </AppLayout>
            </ThemeProvider>

          </SupabaseProvider>
      </body>
    </html>
  );
}
