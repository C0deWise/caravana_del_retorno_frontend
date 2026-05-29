const isBrowser = globalThis.window !== undefined;

export const tokenStorage = {
  setTokens(accessToken: string, refreshToken: string) {
    if (isBrowser) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  },

  setAccessToken(token: string) {
    if (isBrowser) {
      localStorage.setItem("accessToken", token);
    }
  },

  getAccessToken(): string | null {
    if (isBrowser) {
      return localStorage.getItem("accessToken");
    }
    return null;
  },

  getRefreshToken(): string | null {
    if (isBrowser) {
      return localStorage.getItem("refreshToken");
    }
    return null;
  },

  clear() {
    if (isBrowser) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
};
