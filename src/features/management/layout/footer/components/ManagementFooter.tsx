import FooterCurve from "@/components/layout/FooterCurve";
import CopyrightText from "@/components/common/CopyrightText";

export default function ManagementFooter() {
  return (
    <footer className="w-full bottom-0 z-50 overflow-x-clip">
      <div className="bg-primary relative h-9 flex items-end justify-start p-2">
        <FooterCurve />
        <CopyrightText className="text-text-inverse text-sm font-light" />
      </div>
    </footer>
  );
}

