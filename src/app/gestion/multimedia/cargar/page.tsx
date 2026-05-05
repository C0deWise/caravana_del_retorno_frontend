"use client";

import { RequireAuth } from "@/auth/components/RequireAuth";
import LoadContentButton from "@/features/management/multimedia/components/LoadContentButton";

export default function Page() {
  return (
    <RequireAuth roles={["lider_colonia", "admin"]}>
      <div className="p-6">
        <LoadContentButton />
      </div>
    </RequireAuth>
  );
}
