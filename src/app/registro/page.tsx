import AuthRegistroDeUsuarios from "@/features/auth/registro-de-usuarios/components/RegistroDeUsuarios";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Registro de Usuario | Caravana del Retorno",
    description: "Regístrate en la plataforma Caravana del Retorno",
};

export default function RegistroPage() {
    return <AuthRegistroDeUsuarios />;
}
