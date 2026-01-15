import React from "react";
import type { Metadata } from "next";
import 'simplebar-react/dist/simplebar.min.css';
import { Flowbite, ThemeModeScript } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
import "./css/globals.css";
import { GlobalToast } from "@/components/toast";

export const metadata: Metadata = {
  title: "hhw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body className="font-sans">
        <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
        <GlobalToast />
      </body>
    </html>
  );
}
