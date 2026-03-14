import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
    title: "Caravana del Retorno - Inscripción a Colonia",
    description:
        "Inscríbete en la colonia de Caravana del Retorno y forma parte de esta experiencia única. Completa el formulario con tus datos personales y únete a nuestra comunidad.",
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