import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DinaRuns",
  description: "Personal Training Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body
        className={`${geistSans.variable} font-sans bg-[#050505] min-h-screen flex justify-center sm:items-center`}
      >
        {/* Este div simula el iPhone en desktop y es full screen en móvil */}
        <div className="w-full max-w-[400px] h-screen sm:h-[852px] bg-background sm:rounded-[3rem] sm:border-[8px] sm:border-[#1a1a1a] shadow-2xl relative flex flex-col overflow-hidden">
          {/* Contenedor de scroll interno */}
          <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
        </div>
      </body>
    </html>
  );
}
