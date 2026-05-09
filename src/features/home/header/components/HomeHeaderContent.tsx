import MainIcon from "@/components/common/MainIcon";
import MainText from "@/components/common/MainText";
import HeaderCurve from "@/components/layout/HeaderCurve";
import HomeNavbar from "../navbar/components/HomeNavbar";
import Link from "next/link";

export default function HomeHeaderContent() {
  return (
    <div className="bg-primary md:h-24 relative">
      <div className="h-full flex md:px-10 justify-evenly items-center gap-8 flex-wrap md:flex-nowrap overflow-hidden">
        <Link href="/">
          <MainIcon className="md:w-22 md:h-22 md:mt-1 shrink-0 flex-none" />
        </Link>
        <span className="self-stretch w-1.5 rounded-4xl bg-bg md:my-2 flex-none"></span>
        <Link href="/">
          <MainText className="md:mt-1.5 shrink-0 flex-none" size={220} />
        </Link>
        <div className="flex-1 md:flex-shrink md:min-w-0">
          <HomeNavbar />
        </div>
      </div>
      <HeaderCurve />
    </div>
  );
}
