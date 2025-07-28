import type { Metadata } from "next";
import { Geist, Inter, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-share-tech-mono',
});

export const metadata: Metadata = {
  title: "Thalyson Lima | Desenvolvedor Full Stack",
  description: "Portfólio de Thalyson Lima, desenvolvedor full stack com experiência em React, Next.js, React Native, Laravel, C++ e Python.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${inter.variable} ${shareTechMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <ThemeProvider>
          <LoadingScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
