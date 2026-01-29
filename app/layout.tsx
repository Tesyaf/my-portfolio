import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import WindowManagerProvider from "./os/WindowManager";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alif Abrar | Portfolio OS",
  description: "Web Engineer & Data Scientist Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${space.variable} ${jetbrains.variable} ${plex.variable} antialiased bg-[#05060d] text-[#e6ecff]`}
      >
        <WindowManagerProvider>
          {children}
        </WindowManagerProvider>
      </body>
    </html>
  );
}

