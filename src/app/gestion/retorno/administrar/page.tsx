import { RequireAuth } from "@/auth/components/RequireAuth";
import { RetornosPanel } from "@/features/management/return/administration/retornosPanel/RetornosPanel";

export default function AdministrarRetornosPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <RetornosPanel />
    </RequireAuth>
  );
}
