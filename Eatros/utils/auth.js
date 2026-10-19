/**
 * Eatro Client Authentication & Session Utility
 * Handles persistent 7-day login, token expiry checking, and dashboard routing.
 */

/**
 * Decodes JWT payload without verifying signature (client-side only check).
 * @param {string} token 
 * @returns {object|null}
 */
export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

/**
 * Checks if the JWT access token is present and still active (not expired).
 * Includes a 30-second buffer.
 * @param {string} token 
 * @returns {boolean}
 */
export const isAccessTokenActive = (token) => {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false;

  // payload.exp is unix timestamp in seconds
  const expiryTimeMs = payload.exp * 1000;
  return expiryTimeMs > Date.now() + 30000;
};

/**
 * Returns the correct dashboard destination based on user role and saved address.
 * @param {string} role 
 * @returns {string}
 */
export const getDashboardRoute = (role) => {
  if (role === "vendor") {
    return "/restaurant/home_dashboard";
  }
  if (role === "agent") {
    return "/agent/home_dashboard";
  }

  // Customer role (default)
  if (typeof window !== "undefined") {
    const savedAddress = localStorage.getItem("eatroUserAddress");
    if (savedAddress && savedAddress.trim().length > 0) {
      return "/user/home_dashboard";
    }
  }
  return "/auth/location";
};

/**
 * Checks user session. If access token is active (valid within 7 days)
 * or can be refreshed via backend httpOnly cookie, returns the session data and destination route.
 * @returns {Promise<{ isAuthenticated: boolean, route: string, role?: string, user?: object }>}
 */
export const checkUserSession = async () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, route: "/auth/login" };
  }

  const token = localStorage.getItem("eatroAccessToken");
  let user = null;
  try {
    const userStr = localStorage.getItem("eatroUser");
    if (userStr) user = JSON.parse(userStr);
  } catch (e) {}

  // 1. If access token exists and is still valid (e.g. within 7 days)
  if (token && isAccessTokenActive(token)) {
    const role = user?.role || "customer";
    return {
      isAuthenticated: true,
      role,
      user,
      route: getDashboardRoute(role),
    };
  }

  // 2. If access token is expired or missing, try silent refresh with backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.acessToken) {
        localStorage.setItem("eatroAccessToken", data.acessToken);
        const updatedRole = data.role || user?.role || "customer";
        const updatedUser = data.user || user;
        if (updatedUser) {
          localStorage.setItem("eatroUser", JSON.stringify(updatedUser));
        }
        return {
          isAuthenticated: true,
          role: updatedRole,
          user: updatedUser,
          route: getDashboardRoute(updatedRole),
        };
      }
    }
  } catch (err) {
    // Network or server error during silent refresh
    console.warn("Silent session refresh failed:", err);
  }

  // If both access token is expired and refresh failed, clean up local storage
  localStorage.removeItem("eatroAccessToken");
  return { isAuthenticated: false, route: "/auth/login" };
};
