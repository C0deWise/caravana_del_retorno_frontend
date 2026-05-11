import FooterCurve from "@/components/layout/FooterCurve";
import FlorenciaMap from "@/components/common/FlorenciaMap";
import VerticalSeparator from "@/components/layout/VerticalSeparator";
import MainText from "@/components/common/MainText";
import SocialIcon from "@/components/common/SocialIcon";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CopyrightText from "@/components/common/CopyrightText";

export default function HomeFooterContent() {
  return (
    <div className="bg-primary relative">
      <FooterCurve />
      <div className="w-full flex md:h-64 md:max-h-64 md:px-10 justify-evenly items-stretch gap-8">
        <div className="flex-none md:w-auto aspect-square md:py-5">
          <FlorenciaMap />
        </div>
        <div className="md:w-fit md:min-w-0 md:shrink justify-center">
          <div className="flex flex-col md:pl-6 md:pr-6 md:py-5 md:h-fit md:min-w-0">
            <div className="flex w-fit items-center">
              <span className="text-text-inverse font-semibold text-3xl md:text-2xl text-shadow-lg">
                ¡Encuentranos en el mapa!
              </span>
            </div>
            <span className="self-stretch h-1 rounded-full bg-bg flex-none mt-4"></span>
            <div className="flex flex-col mt-2 overflow-hidden">
              <span className="text-text-inverse font-semibold text-xl text-shadow-lg md:pb-2 flex-none">
                Con el apoyo de:
              </span>
              <div className="flex md:w-full gap-4 md:gap-6 relative justify-start items-center md:h-20 flex-wrap shrink overflow-hidden">
                <div className="flex-none flex justify-center items-center h-full w-20">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
                <div className="flex-none flex justify-center items-center h-full w-20">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
                <div className="flex-none flex justify-center items-center h-full w-20">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
                <div className="flex-none flex justify-center items-center h-full w-20">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="w-4 rounded-full overflow-clip md:mb-5 md:mt-2">
          <VerticalSeparator />
        </span>
        <div className="flex flex-1 flex-col md:pb-4 justify-center items-center gap-4 md:flex-none">
          <MainText size={220} />
          <div className="flex flex-row gap-4 md:gap-6">
            <SocialIcon
              href="https://facebook.com"
              src="/social/facebook.svg"
              label="Facebook"
            />
            <SocialIcon
              href="https://instagram.com"
              src="/social/instagram.svg"
              label="Instagram"
            />
          </div>
        </div>
      </div>
      <CopyrightText className="absolute bottom-2 left-0 right-0 text-center text-text-inverse text-sm font-light" />
    </div>
  );
}
