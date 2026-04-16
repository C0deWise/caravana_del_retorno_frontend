import FooterCurve from "../ui/FooterCurve";
import FlorenciaMap from "@/ui/social/FlorenciaMap";
import VerticalSeparator from "@/ui/decorators/VerticalSeparator";
import MainText from "@/ui/general/MainText";
import SocialIcon from "@/ui/social/SocialIcon";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function HomeFooterContent() {
  return (
    <div className="bg-primary md:h-90 relative">
      <FooterCurve />
      <div className="w-full h-11/12 flex">
        <div className="flex-none md:w-auto aspect-square md:pl-10 md:py-5">
          <FlorenciaMap />
        </div>
        <div className="md:w-fit md:h-full justify-center">
          <div className="flex flex-col md:pl-10 md:pr-10 md:h-full md:py-5 md:w-300">
            <div className="flex w-fit items-center space-x-10">
              <ArrowLeftCircleIcon className="text-text-inverse md:w-16 md:h-16 flex-none" />
              <span className="text-text-inverse font-semibold text-4xl text-shadow-lg">
                ¡Encuentranos en el mapa!
              </span>
            </div>
            <span className="self-stretch h-1 rounded-full bg-bg flex-none mt-4"></span>
            <div className="flex flex-col flex-1 min-h-0 mt-2 overflow-hidden">
              <span className="text-text-inverse font-semibold text-xl text-shadow-lg md:pb-4 flex-none">
                Con el apoyo de:
              </span>
              <div className="flex md:w-full flex-1 min-h-0 gap-4 md:gap-6 relative justify-between items-center">
                <div className="flex-1 flex justify-center items-center min-w-0 h-full">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center min-w-0 h-full">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center min-w-0 h-full">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center min-w-0 h-full">
                  <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                    <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="self-stretch w-7 rounded-full overflow-clip md:mr-6 md:mb-5 md:mt-2">
          <VerticalSeparator />
        </span>
        <div className="flex flex-1 flex-col md:mr-7 md:pb-4 justify-between items-center">
          <MainText size={200} />
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
      <span className="absolute bottom-2 right-2 text-text-inverse text-sm font-light">
        © {new Date().getFullYear()} All rights reserved | Caravana del retorno,
        Florencia, Cauca
      </span>
    </div>
  );
}
