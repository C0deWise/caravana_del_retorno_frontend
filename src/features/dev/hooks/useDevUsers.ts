import { useState, useEffect } from "react";
import { UserApi, UserData, CODE_TO_ROLE } from "@/types/user.types";
import { apiService } from "@/services/api.services";
import { authApi } from "@/services/auth.api";

export function useDevUsers(apiMode: boolean) {
  const [realUsers, setRealUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (apiMode && realUsers.length === 0) {
      setIsLoadingUsers(true);
      
      const fetchUsersWithAuth = async () => {
        try {
          const email = process.env.NEXT_PUBLIC_DEV_EMAIL;
          const password = process.env.NEXT_PUBLIC_DEV_PASSWORD;

          if (!email || !password) {
            console.warn("Faltan las credenciales DEV en .env.local (NEXT_PUBLIC_DEV_EMAIL o NEXT_PUBLIC_DEV_PASSWORD)");
            return;
          }
          
          await authApi.login(email, password);
          
          const data = await apiService.get<UserApi[]>("/api/v1/usuario/todos");
          const mapped = data.map(u => {
            const { codigo_rol, ...rest } = u;
            return { ...rest, role: CODE_TO_ROLE[codigo_rol] };
          });
          setRealUsers(mapped);
        } catch (error) {
          console.error("Error en DevTool autenticando o listando usuarios:", error);
        } finally {
          setIsLoadingUsers(false);
        }
      };

      fetchUsersWithAuth();
    }
  }, [apiMode, realUsers.length]);

  return { realUsers, isLoadingUsers };
}
