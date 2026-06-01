import type { Metadata, Viewport } from "next";
import { Anton, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap"
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-plus-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "PromptForge AI",
    template: "%s | PromptForge AI"
  },
  description: "Create, organize, and refine production-ready AI prompts.",
  keywords: ["AI", "Prompt Engineering", "Prompt Management", "Generative AI"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://promptforge.ai",
    title: "PromptForge AI",
    description: "Create, organize, and refine production-ready AI prompts.",
    siteName: "PromptForge AI"
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge AI",
    description: "Create, organize, and refine production-ready AI prompts."
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${plusJakarta.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
