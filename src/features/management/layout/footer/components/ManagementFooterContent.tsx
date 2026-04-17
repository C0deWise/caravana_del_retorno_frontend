import FooterCurve from "@/ui/general/FooterCurve";

export default function ManagementFooterContent() {
  return (
    <div className="bg-primary relative h-6 flex items-end justify-end py-2 px-24">
      <FooterCurve />
      <span className="text-text-inverse text-sm font-light">
        © {new Date().getFullYear()} All rights reserved | Caravana del retorno,
        Florencia, Cauca
      </span>
    </div>
  );
}
