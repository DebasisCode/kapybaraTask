import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Blog Platform",
    template: "%s | Blog Platform",
  },
  description: "A modern blogging platform built with Next.js, tRPC, and PostgreSQL. Write, publish, and share your stories.",
  keywords: ["blog", "blogging platform", "content management", "next.js", "typescript"],
  authors: [{ name: "Blog Platform" }],
  creator: "Blog Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Blog Platform",
    title: "Blog Platform",
    description: "A modern blogging platform built with Next.js, tRPC, and PostgreSQL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Platform",
    description: "A modern blogging platform built with Next.js, tRPC, and PostgreSQL",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <TRPCProvider>
          <Header />
          <main className="min-h-[calc(100vh-8rem)] py-8 md:py-12">{children}</main>
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
