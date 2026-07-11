import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIGNUS | Entrenamiento para Concursos CNSC",
  description:
    "Plataforma de entrenamiento para concursos de méritos de la CNSC. Preguntas, simulacros y seguimiento de tu progreso.",
  metadataBase: new URL("https://dian-academy-o14q.vercel.app"),
  openGraph: {
    title: "DIGNUS | Prepárate para el Concurso DIAN 2676",
    description:
      "Más de 400 preguntas tipo CNSC, simulacros y progreso gamificado. 7 días de prueba gratis, sin tarjeta.",
    images: ["/og-image.jpg"],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0C447C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="DIGNUS" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
