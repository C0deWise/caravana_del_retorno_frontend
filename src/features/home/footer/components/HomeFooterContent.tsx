import Image from "next/image";
import FlorenciaMap from "@/components/common/FlorenciaMap";
import MainText from "@/components/common/MainText";
import SocialIcon from "@/components/common/SocialIcon";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CopyrightText from "@/components/common/CopyrightText";

export default function HomeFooterContent() {
  return (
    <div 
      className="bg-primary relative z-20 flex flex-col -mt-9 overflow-hidden"
      style={{
        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 699 35' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(180 349.5 17.5)'%3E%3Cpath d='M121.358 25.939C69.823 24.413 24.105 20.344 0 0H699C403.142 0 172.894 27.465 121.358 25.939' fill='black'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(black, black)`,
        WebkitMaskSize: '100% clamp(15px, 2.5vw, 35px), 100% calc(100% - clamp(15px, 2.5vw, 35px) + 1px)',
        WebkitMaskPosition: 'top, bottom',
        WebkitMaskRepeat: 'no-repeat',
        maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 699 35' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(180 349.5 17.5)'%3E%3Cpath d='M121.358 25.939C69.823 24.413 24.105 20.344 0 0H699C403.142 0 172.894 27.465 121.358 25.939' fill='black'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(black, black)`,
        maskSize: '100% clamp(15px, 2.5vw, 35px), 100% calc(100% - clamp(15px, 2.5vw, 35px) + 1px)',
        maskPosition: 'top, bottom',
        maskRepeat: 'no-repeat',
      }}
    >
      {/* Wrapper para el patrón para no recortar la curva */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/backgrounds/topography.svg"
          alt="Topography Pattern"
          fill
          className="object-cover opacity-[0.07] mix-blend-overlay"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-10 flex flex-col md:flex-row justify-between items-center md:items-stretch gap-12">
        
        {/* Columna Izquierda: Marca y Redes */}
        <div className="flex flex-col items-center md:items-start gap-6 w-full md:w-1/3">
          <div className="drop-shadow-lg">
            <MainText size={220} />
          </div>
          <p className="text-white/80 text-center md:text-left text-sm max-w-sm leading-relaxed">
            Uniendo caminos y construyendo puentes hacia tus raíces.
          </p>
          <div className="mt-auto flex flex-row gap-4">
            <SocialIcon
              href="https://facebook.com"
              src="/social/facebook.svg"
              label="Facebook"
            />
            <SocialIcon
              href="https://instagram.com"
              src="/social/instagram.svg"
              label="Instagram"
            />
          </div>
        </div>

        {/* Columna Central: Mapa */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <h3 className="text-white font-semibold text-xl tracking-wide drop-shadow-md text-center">
            ¡Encuéntranos en el mapa!
          </h3>
          <div className="mt-auto w-full max-w-[300px] md:max-w-[200px] lg:max-w-[240px] aspect-square rounded-3xl border border-white/20 shadow-2xl bg-white/5 backdrop-blur-sm transition-transform hover:scale-105 duration-500 relative">
            <div className="absolute inset-2 rounded-2xl overflow-hidden">
              <FlorenciaMap />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Apoyo */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <h3 className="text-white font-semibold text-xl tracking-wide drop-shadow-md text-center">
            Con el apoyo de:
          </h3>
          <div className="mt-auto grid grid-cols-2 gap-4 w-full max-w-[300px] md:max-w-[200px] lg:max-w-[240px]">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item}
                className="aspect-square rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white/20 hover:border-white/40 shadow-xl"
              >
                <PhotoIcon className="w-10 h-10 text-white/50" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Barra Inferior: Derechos de Autor */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/10 backdrop-blur-sm py-4">
        <CopyrightText className="text-center text-white/60 text-xs md:text-sm font-light tracking-wide" />
      </div>
    </div>
  );
}
