import { RequireAuth } from "@/auth/components/RequireAuth";
import { ListColonies } from "@/features/management/colony/listColonies/components/ListColonies";

export default function AdministrarColoniasPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ListColonies />
    </RequireAuth>
  );
}
