export const ADMIN_AUTH_KEY = "admin_authenticated";

export const isAuthenticated = (): boolean => {
  const stored = localStorage.getItem(ADMIN_AUTH_KEY);
  if (stored === null) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    return true;
  }
  return stored === "true";
};

export const setAdminAuthenticated = (status: boolean): void => {
  localStorage.setItem(ADMIN_AUTH_KEY, status ? "true" : "false");
};
