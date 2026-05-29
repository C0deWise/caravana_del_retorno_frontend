"use client";

import { RequireAuth } from "@/auth/components/RequireAuth";
import { PublicationsPanel } from "@/features/management/publication/administration/publicationsPanel/PublicationsPanel";

export default function AdministrarPublicacionesPage() {
  return (
    <RequireAuth roles={["admin", "lider_colonia"]}>
      <PublicationsPanel />
    </RequireAuth>
  );
}
