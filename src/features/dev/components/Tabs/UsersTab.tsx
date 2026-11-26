import { useEffect } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { useGetColony } from "@/features/management/colony/hooks/useGetColony";
import { useDev } from "../../context/DevContext";
import { UserData } from "@/types/user.types";
import { ApiConnectionToggle } from "./Users/ApiConnectionToggle";
import { ApiUserSearch } from "./Users/ApiUserSearch";
import { ManualRoleSelector } from "./Users/ManualRoleSelector";
import { DataSimulation } from "./Users/DataSimulation";
import { ActiveUserData } from "./Users/ActiveUserData";

export function UsersTab() {
  const { user, login, logout } = useAuth();
  const { getColony, colony: fetchedColony, loading: loadingColony } = useGetColony();
  const {
    roleOverride,
    setRoleOverride,
    mockUserId,
    setMockUserId,
    mockColoniaId,
    setMockColoniaId,
    apiMode,
    setApiMode,
  } = useDev();

  useEffect(() => {
    if (user?.codigo_colonia) {
      getColony(user.codigo_colonia);
    }
  }, [user?.codigo_colonia, getColony]);

  const displayUser: UserData | null =
    user ??
    (!apiMode && roleOverride !== undefined
      ? {
          id: mockUserId ?? 9999,
          role: roleOverride,
          codigo_colonia: mockColoniaId ?? null,
          fecha_creacion: new Date().toISOString(),
          tipo_doc: "CC",
          documento: "0000000000",
          celular: "0000000000",
          correo: "mock@dev.com",
          nombre: "Usuario",
          apellido: "Mock",
          genero: "otro",
          fecha_nacimiento: "2000-01-01",
          pais: "Colombia",
          departamento: null,
          ciudad: null,
          codigo_retorno: null,
        }
      : null);

  return (
    <>
      <ApiConnectionToggle
        apiMode={apiMode}
        onToggle={() => {
          const newMode = !apiMode;
          setApiMode(newMode);
          if (!newMode) {
            logout();
            setRoleOverride("usuario");
          }
        }}
      />

      <ApiUserSearch apiMode={apiMode} onLogin={login} />

      <ManualRoleSelector 
        apiMode={apiMode} 
        roleOverride={roleOverride} 
        setRoleOverride={setRoleOverride} 
      />

      <DataSimulation
        apiMode={apiMode}
        roleOverride={roleOverride}
        mockUserId={mockUserId}
        setMockUserId={setMockUserId}
        mockColoniaId={mockColoniaId}
        setMockColoniaId={setMockColoniaId}
      />

      <ActiveUserData
        user={displayUser}
        apiMode={apiMode}
        loadingColony={loadingColony}
        fetchedColony={fetchedColony}
      />
    </>
  );
}
