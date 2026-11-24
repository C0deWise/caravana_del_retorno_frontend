"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Línea de detección del scroll spy, como fracción del alto de la pantalla.
 * Una sección es la "actual" cuando esta línea cae dentro de ella.
 */
const SPY_LINE = 0.4;

/**
 * Decide qué enlace del menú está activo.
 *
 * - Enlaces simples (`/historia`): activos cuando la ruta coincide.
 * - Enlaces a una sección (`/inicio#quienes-somos`): activos solo cuando se
 *   está en esa ruta Y la línea de detección (40 % del alto de la pantalla)
 *   está dentro de la sección. Al salir de ella, el subrayado se apaga.
 *
 * Se calcula en el evento `scroll` (agrupado con requestAnimationFrame), que
 * es determinista incluso con saltos bruscos de scroll.
 *
 * Devuelve una función `isActive(href)` para usar en cada enlace.
 */
export function useActiveNavHref(hrefs: string[]) {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // Secciones (id) a vigilar en la ruta actual. Se serializa para que el efecto
  // no se re-ejecute en cada render por una nueva referencia de arreglo.
  const sectionIdsKey = hrefs
    .filter((href) => href.includes("#") && href.split("#")[0] === pathname)
    .map((href) => href.split("#")[1])
    .join(",");

  useEffect(() => {
    const ids = sectionIdsKey ? sectionIdsKey.split(",") : [];
    if (ids.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * SPY_LINE;
      const found = ids.find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect ? rect.top <= line && rect.bottom > line : false;
      });
      setCurrentSection(found ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      setCurrentSection(null);
    };
  }, [pathname, sectionIdsKey]);

  return (href: string) => {
    const [path, hash] = href.split("#");
    if (!hash) return pathname === path;
    return pathname === path && currentSection === hash;
  };
}
