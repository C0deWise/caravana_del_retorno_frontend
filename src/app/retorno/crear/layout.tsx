import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
    title: "Crear Retorno | Caravana del Retorno",
    description: "Registra un nuevo retorno en el sistema, proporcionando detalles como país, departamento y ciudad de origen.",
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