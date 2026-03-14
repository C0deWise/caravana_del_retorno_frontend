import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
    title: 'Caravana del Retorno - Asignar Líder a Colonia',
    description: 'Página para asignar un líder a una colonia en la aplicación Caravana del Retorno',
    icons: {
        icon: "/home/Caravana-Del-Retorno-Icon.svg",
    },
    openGraph: {
        images: ["/home/Caravana-Del-Retorno-Text.svg"],
        type: "website",
    },
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