import { createContext, useContext, ReactNode, useState } from "react";

type Role = "usuario" | "lider_colonia" | "admin" | null;

interface AuthContextType {
  userRole: Role;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<Role>("admin"); // Cambiar aqui para probar con los MOCKs

  const login = (role: Role) => setUserRole(role);
  const logout = () => setUserRole(null);

  return (
    <AuthContext.Provider
      value={{ userRole, isAuthenticated: !!userRole, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
