import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { QueryProvider } from "@/src/providers/query-provider";
import { AuthProvider } from "@/src/providers/auth-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const materialSymbols = localFont({
  src: "../public/fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResuMate",
  description: "AI-powered resume optimization built for modern job seekers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        jetbrainsMono.variable,
        "font-sans",
        inter.variable,
        materialSymbols.variable,
      )}
      suppressHydrationWarning={true}
    >
      <body className="min-h-screen font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
