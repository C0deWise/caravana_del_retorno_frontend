import HeaderCurve from "@/ui/general/HeaderCurve";
import HomeNavbar from "../navbar/components/HomeNavbar";
import HomeMobileMenu from "../navbar/components/HomeMobileMenu";
import HeaderLogo from "./HeaderLogo";
import Link from "next/link";

/**
 * Header público. Logo: "logo croquis icon" (bus + texto en un solo SVG),
 * con la chiva animada al pasar el mouse (ver `HeaderLogo`).
 *
 * Responsive:
 *  - `lg` (≥1024px): logo + menú horizontal (`HomeNavbar`).
 *  - Menos de `lg`: logo + botón hamburguesa (`HomeMobileMenu`).
 *
 * Reemplaza al par MainIcon + MainText, que se conservan en `ui/general`
 * porque los sigue usando el panel de gestión.
 */
export default function HomeHeaderContent() {
  return (
    <div className="relative h-20 bg-primary lg:h-24">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-8 lg:px-0">
        <Link
          href="/"
          className="flex shrink-0 items-center lg:ml-8 lg:mr-6 xl:ml-9 xl:mr-16"
          aria-label="Caravana del Retorno, ir al inicio"
        >
          <HeaderLogo />
        </Link>
        <div className="hidden h-full flex-1 lg:block lg:pr-6">
          <HomeNavbar />
        </div>
        <HomeMobileMenu />
      </div>
      <HeaderCurve />
    </div>
  );
}
