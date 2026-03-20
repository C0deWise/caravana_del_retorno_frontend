"use client";
import { LoggedUserRole } from "../utils/rolePermissions";

interface Props {
  colonyLabel: string;
  userRole: LoggedUserRole;
}

export function ListColonyHeader({ colonyLabel, userRole }: Props) {
  return (
    <div className="mb-8 p-6 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-2">Members of {colonyLabel}</h1>
      <p className="opacity-90">
        Your role: <span className="font-semibold underline">{userRole}</span>
      </p>
    </div>
  );
}
