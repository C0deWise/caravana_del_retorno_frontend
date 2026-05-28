import { useState, useEffect } from "react";
import { UserApi, UserData, CODE_TO_ROLE } from "@/types/user.types";
import { apiService } from "@/services/api.services";

export function useDevUsers(apiMode: boolean) {
  const [realUsers, setRealUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (apiMode && realUsers.length === 0) {
      setIsLoadingUsers(true);
      
      apiService.get<UserApi[]>("/api/v1/usuario/todos")
        .then((data) => {
          const mapped = data.map(u => {
            const { codigo_rol, ...rest } = u;
            return { ...rest, role: CODE_TO_ROLE[codigo_rol] } as UserData;
          });
          setRealUsers(mapped);
        })
        .catch(console.error)
        .finally(() => setIsLoadingUsers(false));
    }
  }, [apiMode, realUsers.length]);

  return { realUsers, isLoadingUsers };
}
