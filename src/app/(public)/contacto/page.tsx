import type { Metadata } from "next";
import ContactSection from "@/features/home/contact/components/ContactSection";

export const metadata: Metadata = {
  title: "Caravana del Retorno - Contacto",
};

/** Página "Contacto": tarjetas de la presidencia, colonias y comité. */
export default function Contacto() {
  return <ContactSection />;
}
