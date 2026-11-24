import Image from "next/image";
import { VALUES } from "../config/landing.config";

/**
 * "Barra de valores" (prototipo v2): Reencuentro, Comunidad, Orgullo y Cultura.
 * Se monta superpuesta al borde inferior del hero.
 * Responsivo en 3 pasos, para que nunca se corte el texto:
 *  - `xl` (≥1280px): una fila de 4 con divisores verticales.
 *  - `md`–`xl` (768–1279px): cuadrícula 2×2, cada valor centrado en su celda.
 *  - Móvil (<768px): lista vertical compacta.
 */
export default function ValuesBar() {
  return (
    <div className="relative z-20 -mt-20 px-4 md:-mt-[62px] md:px-10 xl:px-20">
      <ul className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 rounded-[20px] bg-primary/95 px-5 py-6 shadow-[0_16px_20px_rgba(3,31,46,0.35)] backdrop-blur-[8px] md:grid-cols-2 md:gap-x-6 md:gap-y-6 md:px-8 md:py-7 xl:flex xl:items-center xl:gap-0">
        {VALUES.map((value, i) => (
          <li
            key={value.title}
            className={`flex items-center gap-4 md:justify-center xl:flex-1 xl:justify-start xl:pl-6 xl:pr-4 ${
              i > 0 ? "xl:border-l xl:border-text-inverse/20" : ""
            }`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-text-inverse/40 md:size-[68px]">
              <Image
                src={value.icon}
                alt=""
                width={32}
                height={32}
                className="size-6 md:size-8"
              />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[15px] font-extrabold uppercase leading-tight tracking-[0.03em] text-text-inverse md:text-[17px]">
                {value.title}
              </span>
              <span className="text-sm leading-[1.45] text-text-inverse/80 md:max-w-[17ch]">
                {value.description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
