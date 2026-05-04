"use client";

import { RequireAuth } from "@/auth/components/RequireAuth";
import dynamic from "next/dynamic";

const LoadContentButton = dynamic(
  () => import("@/features/management/multimedia/components/LoadContentButton"),
  { ssr: false },
);

export default function Page() {
  return (
    <RequireAuth roles={["lider_colonia", "admin"]}>
      <div className="p-6">
        <LoadContentButton />
      </div>
    </RequireAuth>
  );
}
