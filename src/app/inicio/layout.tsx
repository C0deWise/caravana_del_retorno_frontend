import HomeHeader from "@/features/home/header/components/HomeHeader";
import HomeFooter from "@/features/home/footer/components/HomeFooter";

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </>
  );
}
