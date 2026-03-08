import HeaderIcon from "@/ui/components/HeaderIcon";
import HeaderText from "@/ui/components/HeaderText";
import HeaderCurve from "@/ui/components/HeaderCurve";
import HomeNavbar from "../../navbar/components/HomeNavbar";

export default function HomeHeaderContent() {
  return (
    <div className="bg-primary md:h-24 relative">
      <div className="h-full flex">
        <HeaderIcon className="md:w-22 md:h-22 md:ml-9 md:mt-1 shrink-0" />
        <span className="self-stretch w-1.5 rounded-4xl bg-bg ml-4 mr-1 my-2"></span>
        <HeaderText className="md:w-50 md:h-24 md:pt-3 md:mr-10 shrink-0" />
        <div className="flex-1 md:px-4">
          <HomeNavbar />
        </div>
      </div>
      <HeaderCurve />
    </div>
  );
}
