import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
  title: "Caravana del Retorno - Inicio",
  description:
    "¡Bienvenidos a la página web oficial de la Caravana del Retorno, Florencia, Cauca, Popayán!",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader />
      <main className="grow w-full flex flex-col">{children}</main>
    </>
  );
}
