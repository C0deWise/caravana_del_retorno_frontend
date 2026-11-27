import FooterCurve from "@/components/layout/FooterCurve";
import CopyrightText from "@/components/common/CopyrightText";
import { MarqueeText } from "@/components/common/MarqueeText";

export default function ManagementFooter() {
  const copyrightLabel = `© ${new Date().getFullYear()} All rights reserved | Caravana del retorno, Florencia, Cauca | Made with love by C0deWise`;

  return (
    <footer className="w-full shrink-0 z-30">
      <div className="bg-primary relative h-4 sm:h-9 flex items-end justify-start px-3 sm:px-6 pb-0">
        <FooterCurve />
        <div className="w-full sm:hidden overflow-hidden flex items-end">
          <MarqueeText
            text={copyrightLabel}
            className="text-text-inverse text-[10px] leading-none font-light !py-0"
          />
        </div>
        <CopyrightText className="hidden sm:block text-text-inverse text-xs sm:text-sm font-light truncate" />
      </div>
    </footer>
  );
}
