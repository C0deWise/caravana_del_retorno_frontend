import { RequireAuth } from "@/auth/components/RequireAuth";
import { ColoniesPanel } from "@/features/management/colony/administration/coloniesPanel/ColoniesPanel";

export default function AdministrarColoniasPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <ColoniesPanel />
    </RequireAuth>
  );
}
