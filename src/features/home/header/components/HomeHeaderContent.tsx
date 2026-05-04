import MainIcon from "@/components/common/MainIcon";
import MainText from "@/components/common/MainText";
import HeaderCurve from "@/components/layout/HeaderCurve";
import HomeNavbar from "../navbar/components/HomeNavbar";
import Link from "next/link";

export default function HomeHeaderContent() {
  return (
    <div className="bg-primary md:h-24 relative">
      <div className="h-full flex">
        <Link href="/">
          <MainIcon className="md:w-22 md:h-22 md:ml-9 md:mt-1 shrink-0" />
        </Link>
        <span className="self-stretch w-1.5 rounded-4xl bg-bg ml-4 mr-1 my-2"></span>
        <Link href="/">
          <MainText className="mt-1.5 md:mr-20 shrink-0" size={220} />
        </Link>
        <div className="flex-1 md:px-4">
          <HomeNavbar />
        </div>
      </div>
      <HeaderCurve />
    </div>
  );
}

