import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HomeHeader from "@/features/home/header/components/HomeHeader";
import HomeFooter from "@/features/home/footer/components/HomeFooter";
import ErrorBoundary from "@/ui/general/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Caravana del Retorno - Inicio",
  description:
    "¡Bienvenidos a la página web oficial de la Caravana del Retorno, Florencia, Cauca, Colombia!",
  icons: {
    icon: "/home/Caravana-Del-Retorno-Icon.svg",
  },
  openGraph: {
    images: ["/home/Caravana-Del-Retorno-Text.svg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        <HomeHeader />
        <main>
          <ErrorBoundary
            fallback={
              <div className="flex justify-center items-center w-auto my-90 mx-200 h-auto p-4 bg-red-100 text-red-800 rounded-xl">
                Error en contenido
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </main>
        <HomeFooter />
      </body>
    </html>
  );
}
