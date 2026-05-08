"use client";

import { CreatePublicationButton } from "@/features/management/publication/createPublication/components/CreatePublicationButton";
import { RequireAuth } from "@/auth/components/RequireAuth";

export default function CrearPublicacionPage() {
  return (
    <RequireAuth roles={["admin", "lider_colonia"]}>
      <div className="p-6">
        <CreatePublicationButton />
      </div>
    </RequireAuth>
  );
}
