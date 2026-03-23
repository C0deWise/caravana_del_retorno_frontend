import ListAccessRequest from "@/features/management/colony/listAccessRequestToColony/components/ListAccessRequest";

interface NotificacionesByIdPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NotificacionesByIdPage({ params }: NotificacionesByIdPageProps) {
    const { id } = await params;
    const colonyId = Number(id);

    return <ListAccessRequest paramsId={colonyId} />;
}