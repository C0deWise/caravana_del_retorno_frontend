import ListRelationships from '@/features/management/relationship/listRelationships/components/ListRelationships';

interface ListarParentescosByIdPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ListarParentescosByIdPage({ params }: ListarParentescosByIdPageProps) {
    const { id } = await params;

    return <ListRelationships paramsId={id} />;
}
