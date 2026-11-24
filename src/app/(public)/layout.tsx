import HomeHeader from "@/features/home/header/components/HomeHeader";
import HomeFooter from "@/features/home/footer/components/HomeFooter";

/**
 * Layout compartido del portal público.
 *
 * `(public)` es un grupo de rutas: los paréntesis NO forman parte de la URL
 * (`/inicio`, `/historia`, `/programacion`, `/donar`, `/contacto`,
 * `/auth/registro` siguen igual).
 *
 * Al vivir el header y el footer en un solo layout, Next.js los monta una
 * única vez y los conserva al navegar entre estas páginas: solo cambia el
 * contenido de `<main>`. Antes cada ruta tenía su propio layout idéntico, y al
 * cambiar de página se destruían y recreaban (parpadeo).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </>
  );
}
