"use client";
import { useParams } from "next/navigation";
import { useMembers } from "@/features/management/colony/listColonyMembers/hooks/useMembers";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MemberTable } from "@/features/management/colony/listColonyMembers/components/MemberTable";
import { ListColonyHeader } from "@/features/management/colony/listColonyMembers/components/ListColonyHeader";
import { useEffect, useRef } from "react";

export default function ListColonyMembersPage() {
  const params = useParams();
  const colonyId = Number(params.id);

  console.log("🆔 Colony ID:", colonyId); // DEBUG

  const { members, loadMore, hasMore, colonyLabel } = useMembers(colonyId);
  const { userRole } = useAuth();
  const sentinelRef = useRef<HTMLDivElement>(null);

  console.log("👥 Members:", members.length, "Label:", colonyLabel); // DEBUG

  // FIX: Carga inicial inmediata + reset page
  useEffect(() => {
    console.log("🔄 Initial load for colony:", colonyId);
    loadMore();
  }, [colonyId]); // Solo colonyId

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        console.log("📜 Loading more...");
        loadMore();
      }
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (!userRole) return <div>Access denied</div>;

  return (
    <div className="w-full h-full p-6">
      <div>
        Colony ID: {colonyId} | Members: {members.length} | Role: {userRole}
      </div>
      <div className="mb-8 p-6 bg-blue-500 text-white rounded-xl">
        <h1>Members of {colonyLabel}</h1>
      </div>
      <MemberTable members={members} userRole={userRole} />
      {hasMore && <div ref={sentinelRef}>Loading...</div>}
    </div>
  );
}
