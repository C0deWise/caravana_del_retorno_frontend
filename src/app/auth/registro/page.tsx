import Image from "next/image";
import AuthUserRegistration from "@/features/management/user/userRegistry/components/AuthUserRegistration";

export default function RegistroPage() {
  return (
    <div className="relative w-full min-h-[100dvh] md:min-h-[900px] flex flex-col justify-center overflow-hidden">
      <Image
        src="/backgrounds/mesh-registro.webp"
        alt="Fondo de registro"
        fill
        sizes="100vw"
        priority
        className="object-cover absolute inset-0 -z-10 blur-3xl scale-140"
        unoptimized
      />
      
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col justify-center px-4 sm:px-6 md:px-8 pt-16 pb-14 md:py-8 lg:py-16">
        <AuthUserRegistration />
      </div>
    </div>
  );
}
