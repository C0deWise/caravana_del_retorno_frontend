"use client";
import { Member } from "../types/member";
import { LoggedUserRole, getVisibleMemberData } from "../utils/rolePermissions";
import { Fragment } from "react";

interface Props {
  member: Member;
  userRole: LoggedUserRole;
}

export function MemberRow({ member, userRole }: Props) {
  const visibleData = getVisibleMemberData(member, userRole);

  return (
    <Fragment>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Document - solo lider/admin */}
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${userRole === "usuario" ? "text-gray-400" : "font-medium"}`}
        >
          {("documentNumber" in visibleData && visibleData.documentNumber) ||
            "..."}
        </td>

        {/* Name */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {visibleData.firstName} {visibleData.lastName}
          </div>
        </td>

        {/* Role */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              member.role === "admin"
                ? "bg-red-100 text-red-800"
                : member.role === "lider_colonia"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {member.role}
          </span>
        </td>

        {/* Phone */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {visibleData.phone || "..."}
        </td>

        {/* Birth Date - solo lider/admin */}
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${userRole === "usuario" ? "text-gray-400" : ""}`}
        >
          {("birthDate" in visibleData && visibleData.birthDate) || "..."}
        </td>
      </tr>
    </Fragment>
  );
}
