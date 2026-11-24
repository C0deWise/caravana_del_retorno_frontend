import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import ContactCard from "./ContactCard";
import { CONTACT_COPY, CONTACTS } from "../config/contact.config";

/**
 * Página "Contacto": la presidencia destacada arriba y, debajo, las tarjetas
 * de presidentes de colonia y del comité de organización.
 */
export default function ContactSection() {
  const [featured, ...others] = CONTACTS;

  return (
    <section
      aria-labelledby="contacto-title"
      className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pb-24 pt-16 md:px-10 md:pt-24 xl:px-20"
    >
      <header className="flex flex-col gap-3">
        <p className="flex items-center gap-2.5 text-sm font-semibold text-primary">
          <InstitutionalStripe className="h-1.5 w-10" />
          {CONTACT_COPY.eyebrow}
        </p>
        <h1 id="contacto-title" className="text-2xl font-bold leading-tight text-primary md:text-[30px]">
          {CONTACT_COPY.title}
        </h1>
        <p className="max-w-[720px] text-base text-text-muted">{CONTACT_COPY.body}</p>
      </header>

      {featured && <ContactCard person={featured} featured />}

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {others.map((person) => (
          <li key={person.key}>
            <ContactCard person={person} />
          </li>
        ))}
      </ul>
    </section>
  );
}
