import HomeNavbarWrapper from "../../navbar/components/HomeNavbarWrapper";

export default function HomeHeaderContent() {
  return (
    <div className="bg-primary md:p-4 md:h-30">
      <div className="h-full border border-accent-red">
        <HomeNavbarWrapper />
      </div>
    </div>
  );
}
