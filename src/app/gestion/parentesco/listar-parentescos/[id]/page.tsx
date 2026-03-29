import ListRelationships from "@/features/management/relationship/listRelationships/components/ListRelationships";

interface ListarParentescosByIdPageProps {
  params: Promise<{
    id: number;
  }>;
}

export default async function ListarParentescosByIdPage({
  params,
}: ListarParentescosByIdPageProps) {
  const { id } = await params;

  return <ListRelationships paramsId={id} />;
}
