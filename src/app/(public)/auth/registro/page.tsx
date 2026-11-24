import AuthUserRegistration from "@/features/management/user/userRegistry/components/AuthUserRegistration";

/**
 * Página de registro de usuario.
 *
 * El contenedor NO tiene alto fijo: antes usaba `h-140` (560px) con el
 * contenido centrado, y como el formulario mide al menos una pantalla
 * (`min-h-screen`), se desbordaba por arriba y por abajo y el footer quedaba
 * encima de los campos, impidiendo llenarlos. Ahora la caja crece con el
 * formulario y el footer siempre queda debajo.
 */
export default function RegistroPage() {
  return (
    <div className="mx-4 mb-24 mt-16 rounded-lg border-0 bg-white shadow-lg md:mx-10 xl:mx-20">
      <AuthUserRegistration />
    </div>
  );
}
