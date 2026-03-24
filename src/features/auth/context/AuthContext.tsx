import { createContext, useContext, ReactNode, useState } from "react";
import { User } from "../../../types/user.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// TODO: eliminar cuando el back esté listo
const MOCK_USER: User = {
  id: 1,
  documentNumber: "CC10000000",
  documentType: "CC",
  firstName: "Mock",
  lastName: "User",
  gender: "M",
  birthDate: "1990-01-01",
  phone: "+573001000000",
  role: "usuario",
  colonyId: 1,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER); // TODO: null cuando haya back

  const login = (newUser: User) => setUser(newUser);

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, updateUser, logout }}
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
