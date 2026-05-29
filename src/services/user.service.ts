import { apiService, ApiError } from "@/services/api.services";
import type { UserApi, UserSearchResult } from "@/types/user.types";
import { listColonyMembers } from "./colony.service";

const userCache = new Map<number, UserSearchResult>();
const pendingRequests = new Map<number, Promise<UserSearchResult>>();

export const userService = {
  getUserById: async (id: number): Promise<UserSearchResult> => {
    if (userCache.has(id)) {
      return userCache.get(id)!;
    }

    if (pendingRequests.has(id)) {
      return pendingRequests.get(id)!;
    }

    const request = apiService.get<UserSearchResult>(`/api/v1/usuario/buscar_id/${id}/`);
    pendingRequests.set(id, request);

    try {
      const userData = await request;
      userCache.set(id, userData);
      return userData;
    } finally {
      pendingRequests.delete(id);
    }
  },

  getUserFromCache: (id: number): UserSearchResult | undefined => {
    return userCache.get(id);
  },

  searchByName: async (nombre: string): Promise<UserSearchResult[]> => {
    const results = await apiService.get<UserSearchResult[]>(
      `/api/v1/usuario/buscar/${encodeURIComponent(nombre)}`,
    );
    results.forEach(user => userCache.set(user.id, user));
    return results;
  },

  searchByDocument: async (documento: string): Promise<UserSearchResult> => {
    const user = await apiService.get<UserSearchResult>(`/api/v1/usuario/buscar_documento/${documento}`);
    if (user) userCache.set(user.id, user);
    return user;
  },

  safeSearchByDocument: async (documento: string): Promise<UserSearchResult[]> => {
    try {
      const user = await userService.searchByDocument(documento);
      return user ? [user] : [];
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return [];
      throw err;
    }
  },

  createSearchFn: async (
    mode: string,
    value: string,
    colonyId?: number | null,
  ): Promise<UserSearchResult[]> => {
    const trimmed = value.trim();

    if (colonyId != null) {
      const colonyUsers = await listColonyMembers(colonyId);
      const mapped: UserSearchResult[] = colonyUsers.map((u) => ({
        ...u,
        codigo_rol: u.role as UserApi["codigo_rol"],
        fecha_creacion: "",
        codigo_retorno: null,
        pais: "",
        departamento: null,
        ciudad: null,
      }));

      return mapped.filter((u) => {
        const fullName = `${u.nombre} ${u.apellido}`.toLowerCase();
        const doc = u.documento ?? "";
        const q = trimmed.toLowerCase();
        if (mode === "documento") return doc.includes(q);
        if (mode === "nombre") return fullName.includes(q);
        return fullName.includes(q) || doc.includes(q);
      });
    }

    if (mode === "nombre") {
      return userService.searchByName(trimmed);
    }

    if (mode === "documento") {
      return userService.safeSearchByDocument(trimmed);
    }

    return /^\d+$/.test(trimmed)
      ? userService.safeSearchByDocument(trimmed)
      : userService.searchByName(trimmed);
  },
};


