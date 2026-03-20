"use client";
import { useAuth } from "../context/AuthContext";

export function RoleSwitcher() {
  const { userRole, login } = useAuth();
  return (
    <div className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded">
      Role: {userRole || "guest"} |
      <button onClick={() => login("usuario")} className="ml-2">
        User
      </button>
      <button onClick={() => login("lider_colonia")} className="ml-2">
        Leader
      </button>
      <button onClick={() => login("admin")} className="ml-2">
        Admin
      </button>
    </div>
  );
}
