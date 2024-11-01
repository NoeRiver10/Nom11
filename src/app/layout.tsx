import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AreasYpuestosProvider } from "./context/areaypuestos"; // Importar el contexto

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App", // Este título será sobrescrito si se especifica uno en la página
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Puedes agregar más metadatos aquí si lo necesitas */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AreasYpuestosProvider>
          {children}
        </AreasYpuestosProvider>
      </body>
    </html>
  );
}
