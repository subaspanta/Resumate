import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { ThemedToaster } from "@/src/providers/themed-toaster";
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

/**
 * Without this, mobile browsers lay the page out in a ~980px virtual
 * viewport and then scale the result down to fit — every breakpoint below
 * 1024px never matches, and text renders at a fraction of its intended size.
 * The responsive CSS in this app was effectively dead on real phones.
 *
 * No maximum-scale or user-scalable: pinch-zoom is an accessibility
 * affordance, and disabling it is a WCAG 1.4.4 failure.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SidebarProvider>
                {children}
                <ThemedToaster />
              </SidebarProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
