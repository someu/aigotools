import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import clsx from "clsx";
import { Inter } from "next/font/google";
import "./globals.css";
import { Viewport } from "next";

import { AppConfig } from "../lib/config";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html suppressHydrationWarning>
      <body className={clsx(inter.className)}>
        {children}
        <Analytics />
        <GoogleAnalytics gaId={AppConfig.googleAnalyticsID} />
      </body>
    </html>
  );
}
