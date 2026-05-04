"use client";

import { RequireAuth } from "@/auth/components/RequireAuth";
import dynamic from "next/dynamic";

const LoadContent = dynamic(
  () => import("@/features/management/multimedia/components/LoadContent"),
  { ssr: false },
);

export default function Page() {
  return (
    <RequireAuth roles={["lider_colonia", "admin"]}>
      <LoadContent />
    </RequireAuth>
  );
}
