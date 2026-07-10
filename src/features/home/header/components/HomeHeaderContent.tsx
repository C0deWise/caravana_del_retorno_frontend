"use client";

import Image from "next/image";
import MainIcon from "@/components/common/MainIcon";
import MainText from "@/components/common/MainText";
import HomeNavbar from "../navbar/components/HomeNavbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

export default function HomeHeaderContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="relative z-20 pb-4 md:pb-6 lg:pb-8 xl:pb-10 -mb-12">
        {/* Capa de fondo con la máscara de la curva */}
        <div 
          className="absolute inset-0 bg-primary pointer-events-none"
          style={{
            WebkitMaskImage: `linear-gradient(black, black), url("data:image/svg+xml,%3Csvg viewBox='0 0 699 35' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M121.358 25.939C69.823 24.413 24.105 20.344 0 0H699C403.142 0 172.894 27.465 121.358 25.939' fill='black'/%3E%3C/svg%3E")`,
            WebkitMaskSize: '100% calc(100% - clamp(15px, 2.5vw, 35px) + 1px), 100% clamp(15px, 2.5vw, 35px)',
            WebkitMaskPosition: 'top, bottom',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `linear-gradient(black, black), url("data:image/svg+xml,%3Csvg viewBox='0 0 699 35' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M121.358 25.939C69.823 24.413 24.105 20.344 0 0H699C403.142 0 172.894 27.465 121.358 25.939' fill='black'/%3E%3C/svg%3E")`,
            maskSize: '100% calc(100% - clamp(15px, 2.5vw, 35px) + 1px), 100% clamp(15px, 2.5vw, 35px)',
            maskPosition: 'top, bottom',
            maskRepeat: 'no-repeat',
          }}
        >
          {/* Patrón de topografía */}
          <Image
            src="/backgrounds/topography.svg"
            alt="Topography Pattern"
            fill
            className="object-cover opacity-[0.07] mix-blend-overlay"
            priority
            loading="eager"
          />
        </div>

        {/* Contenido del Header */}
        <div className="relative z-10 flex h-[72px] md:h-20 lg:h-[88px] xl:h-[88px] flex-nowrap items-center justify-between gap-4 xl:gap-8 px-6 xl:pl-24 xl:pr-10">
          
          {/* LOGO GROUP */}
          <div className="flex items-center gap-4 xl:gap-6 shrink-0 flex-none">
            <Link href="/" className="shrink-0 flex-none flex items-center">
              {/* Desktop Icon (xl+) */}
              <div className="hidden xl:block shrink-0 flex-none">
                <MainIcon size={68} />
              </div>
              {/* iPad Pro Icon (lg to xl) */}
              <div className="hidden lg:block xl:hidden shrink-0 flex-none">
                <MainIcon size={80} />
              </div>
              {/* iPad Mini Icon (md to lg) */}
              <div className="hidden md:block lg:hidden shrink-0 flex-none">
                <MainIcon size={72} />
              </div>
              {/* Mobile Icon (< md) */}
              <div className="block md:hidden shrink-0 flex-none">
                <MainIcon size={64} />
              </div>

              {/* iPad Pro Text (lg to xl) */}
              <div className="hidden lg:block xl:!hidden ml-3 mt-1 shrink-0 flex-none">
                <MainText size={215} className="w-full h-full" />
              </div>
              {/* iPad Mini Text (md to lg) */}
              <div className="hidden md:block lg:hidden ml-3 mt-1 shrink-0 flex-none">
                <MainText size={195} className="w-full h-full" />
              </div>
              {/* Mobile Text (< md) */}
              <div className="block md:hidden ml-3 mt-1 shrink-0 flex-none">
                <MainText size={172} className="w-full h-full" />
              </div>
            </Link>

            <span className="hidden xl:block h-10 w-[3px] rounded-full bg-white/20 shrink-0 flex-none"></span>

            <Link href="/" className="hidden xl:block shrink-0 flex-none flex items-center">
              {/* Desktop Text */}
              <MainText className="shrink-0 flex-none mt-1" size={170} />
            </Link>
          </div>

          {/* Navegación Desktop */}
          <div className="hidden xl:flex flex-1 xl:shrink min-w-0">
            <HomeNavbar />
          </div>

          {/* Botón Menú Hamburguesa Móvil/iPad */}
          <button
            className="xl:hidden text-white hover:text-secondary transition-colors p-2 -mr-2 focus:outline-none shrink-0"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Bars3Icon className="w-9 h-9" />
          </button>
        </div>
      </div>

      {/* Menú Sidebar Móvil */}
      {mounted && createPortal(
        <div 
          className={`fixed inset-0 z-[100] transition-all duration-500 xl:hidden ${
            isMobileMenuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
          }`}
        >
          {/* Backdrop oscuro */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <div 
            className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-primary/50 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="relative z-10 flex flex-col h-full w-full">
              {/* Cabecera del menú móvil con Topografía */}
              <div className="relative overflow-hidden flex items-center justify-between px-6 h-20 border-b border-white/10 flex-none bg-primary z-20 shadow-sm">
                {/* Patrón de fondo en la cabecera */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src="/backgrounds/topography.svg"
                    alt="Topography Pattern"
                    fill
                    className="object-cover opacity-[0.08] mix-blend-overlay"
                    priority
                  />
                </div>
                
                <span className="relative z-10 text-white font-semibold text-lg">Menú Principal</span>
                <button
                  className="relative z-10 text-white hover:text-accent-red transition-colors p-2 -mr-2 focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <XMarkIcon className="w-8 h-8" />
                </button>
              </div>

              {/* Enlaces de navegación (Efecto Frosted) */}
              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col transition-opacity duration-300">
                <HomeNavbar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
