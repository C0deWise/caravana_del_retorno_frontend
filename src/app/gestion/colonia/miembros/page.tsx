import ListColonyMembers from "@/features/management/colony/colonyMembers/components/ListColonyMembers";

interface Props {
  searchParams: Promise<{ colonyId?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const paramsId = params?.colonyId ? Number(params.colonyId) : undefined;

  return (
    <>
      <div className="flex justify-center">
        <span className="text-accent-red text-2xl bg-accent-yellow/70 rounded-full w-fit px-4 py-2 mb-5">
          MISSING API
        </span>
      </div>
      <ListColonyMembers paramsId={paramsId} />
    </>
  );
}
