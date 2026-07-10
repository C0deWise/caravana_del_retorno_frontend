import HeaderContent from "./HomeHeaderContent";

export default function HomeHeader() {
  return (
    <header className="w-full sticky top-0 z-50 drop-shadow-[0_8px_15px_rgba(0,0,0,0.35)] overflow-x-clip">
      <HeaderContent />
    </header>
  );
}
