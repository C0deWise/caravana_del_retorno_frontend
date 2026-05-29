let accessToken: string | null = null;

export const tokenStorage = {
  setAccessToken(token: string) {
    accessToken = token;
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  clear() {
    accessToken = null;
  },
};
