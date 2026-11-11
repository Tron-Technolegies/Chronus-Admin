const decodeJwtPayload = (token) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  STORE_MANAGER: "Store Manager",
};

export const normalizeRole = (role) => {
  if (!role) return null;
  const str = String(role).trim().toLowerCase().replace(/[_\s-]+/g, "");
  if (str === "superadmin" || str === "admin" || str === "superuser") {
    return ROLES.SUPER_ADMIN;
  }
  if (str === "storemanager" || str === "manager" || str === "staff") {
    return ROLES.STORE_MANAGER;
  }
  return role;
};

export const getUserRole = () => {
  const storedRole = localStorage.getItem("userRole");
  if (storedRole) {
    const normalized = normalizeRole(storedRole);
    if (normalized) return normalized;
  }

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.is_superuser) return ROLES.SUPER_ADMIN;
      if (Array.isArray(user.groups)) {
        const isManager = user.groups.some(
          (g) => (typeof g === "string" ? g : g.name) === "Store Manager"
        );
        if (isManager) return ROLES.STORE_MANAGER;
      }
      if (user.role) {
        const normalized = normalizeRole(user.role);
        if (normalized) return normalized;
      }
      if (user.is_staff) return ROLES.STORE_MANAGER;
    }
  } catch {}

  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  if (payload.is_superuser) return ROLES.SUPER_ADMIN;
  if (Array.isArray(payload.groups)) {
    const isManager = payload.groups.some(
      (g) => (typeof g === "string" ? g : g.name) === "Store Manager"
    );
    if (isManager) return ROLES.STORE_MANAGER;
  }
  if (payload.role) {
    const normalized = normalizeRole(payload.role);
    if (normalized) return normalized;
  }
  if (payload.user_type) {
    const normalized = normalizeRole(payload.user_type);
    if (normalized) return normalized;
  }
  if (payload.role_name) {
    const normalized = normalizeRole(payload.role_name);
    if (normalized) return normalized;
  }
  if (payload.is_staff) return ROLES.STORE_MANAGER;

  return null;
};

export const isSuperAdmin = () => {
  return getUserRole() === ROLES.SUPER_ADMIN;
};

export const isStoreManager = () => {
  return getUserRole() === ROLES.STORE_MANAGER;
};

export const clearAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("user");
};

export const isTokenValid = (token) => {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowInSeconds;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  const valid = isTokenValid(token);
  if (!valid) clearAuthTokens();
  return valid;
};
