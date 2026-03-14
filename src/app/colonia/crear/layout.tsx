import HomeHeader from "@/features/home/header/components/HomeHeader";

export const metadata = {
    title: "Caravana del Retorno - Crear colonia",
    description:
        "Página para crear una nueva colonia en la Caravana del Retorno. Administra y organiza tus colonias de manera eficiente.",
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