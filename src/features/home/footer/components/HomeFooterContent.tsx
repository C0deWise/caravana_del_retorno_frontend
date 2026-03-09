import FooterCurve from "@/ui/footer/FooterCurve";
import Separator from "@/ui/general/Separator";
import HomeMap from "../../mapa/components/HomeMap";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function HomeFooterContent() {
  return (
    <div className="bg-primary md:h-100 relative">
      <FooterCurve />
      <div className="w-full h-full flex">
        <div className="flex-none md:w-auto aspect-square md:pl-10 md:py-5">
          <HomeMap />
        </div>
        <div className="md:w-fit md:h-auto justify-center">
          <div className="flex flex-col pl-10 space-y-6 mr-9">
            <div className="flex w-fit items-center mt-10 space-x-10">
              <ArrowLeftCircleIcon className="text-text-inverse md:w-16 md:h-16" />
              <span className="text-text-inverse font-semibold text-4xl">
                ¡Encuentranos en el mapa!
              </span>
            </div>
            <span className="self-stretch h-1 rounded-4xl bg-bg"></span>
            <div className="flex flex-col w-1/2">
              <span className="text-text-inverse font-semibold text-xl md:py-4">
                Con el apoyo de:
              </span>
              <div className="flex md:w-fit md:h-40 md:space-x-6">
                <div className="bg-bg/15 rounded-xl relative aspect-square">
                  <PhotoIcon className="w-20 h-20 text-text-inverse absolute inset-0 m-auto" />
                </div>
                <div className="bg-bg/15 rounded-xl relative aspect-square">
                  <PhotoIcon className="w-20 h-20 text-text-inverse absolute inset-0 m-auto" />
                </div>
                <div className="bg-bg/15 rounded-xl relative aspect-square">
                  <PhotoIcon className="w-20 h-20 text-text-inverse absolute inset-0 m-auto" />
                </div>
                <div className="bg-bg/15 rounded-xl relative aspect-square">
                  <PhotoIcon className="w-20 h-20 text-text-inverse absolute inset-0 m-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="w-10 h-100  border-2 border-accent-yellow">
          <Separator className="rotate-90" />
        </span>
        <div className="flex flex-col border border-accent-red">colmunb</div>
      </div>
    </div>
  );
}
