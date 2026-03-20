"use client";
import { Member } from "../types/member";
import { LoggedUserRole } from "../utils/rolePermissions";
import { MemberRow } from "./MemberRow";

interface Props {
  members: Member[];
  userRole: LoggedUserRole;
}

export function MemberTable({ members, userRole }: Props) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-linear-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Document
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Birth Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((member) => (
            <MemberRow key={member.id} member={member} userRole={userRole} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
