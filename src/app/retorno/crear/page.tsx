import CrearRetorno from "@/features/gestion/retorno/components/CrearRetorno";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crear Retorno | Caravana del Retorno",
    description: "Crear un nuevo retorno en la plataforma Caravana del Retorno",
};

export default function CrearRetornoPage() {
    return <CrearRetorno />;
}
