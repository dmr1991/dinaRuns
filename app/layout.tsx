import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DinaRuns",
  description: "Fitness tracker personalizado para Dina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#050505] flex justify-center sm:items-center">

        <div className="w-full max-w-[400px] h-full sm:h-[850px] bg-background sm:rounded-[3rem] sm:border-[8px] sm:border-[#1a1a1a] sm:shadow-2xl overflow-hidden relative flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
        </div>
      </body>
    </html>
  );
}
