import HomeHeader from "@/features/home/header/components/HomeHeader";
import HomeFooter from "@/features/home/footer/components/HomeFooter";

export default function InicioLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-bg">
      <HomeHeader />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <main className="flex-1 flex flex-col">{children}</main>
        <HomeFooter />
      </div>
    </div>
  );
}
