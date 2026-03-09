import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
    title: "Caravana del Retorno - Registro",
    description:
        "¡Registrate en la caravana del retorno y forma parte de nuestra comunidad! Crea tu cuenta para acceder a todas las funcionalidades y beneficios que ofrecemos. Únete a nosotros hoy mismo y comienza tu viaje con la Caravana del Retorno.",
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