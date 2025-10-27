// Utility functions for authentication

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

