import ListColonyMembers from "@/features/management/colony/colonyMembers/components/ListColonyMembers";

interface Props {
  searchParams: Promise<{ colonyId?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const paramsId = params?.colonyId ? Number(params.colonyId) : undefined;

  return (
    <>
      <ListColonyMembers paramsId={paramsId} />
    </>
  );
}
