import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
    title: "Registro de Usuario | Caravana del Retorno",
    description: "Regístrate en la plataforma Caravana del Retorno", 
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