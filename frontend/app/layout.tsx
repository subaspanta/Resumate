import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/src/providers/query-provider";
import { AuthProvider } from "@/src/providers/auth-provider";
import { SidebarProvider } from "@/src/providers/sidebar-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Resumate",
  description:
    "AI-powered career gap analysis and learning roadmap for job seekers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(jetbrainsMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning={true}
    >
      <body className="min-h-screen font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider>
              {children}
              <Toaster position="top-right" richColors />
            </SidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
