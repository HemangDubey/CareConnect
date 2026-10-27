/**
 * Client-side JWT token verification utilities
 * Note: This is for client-side validation only.
 * Server-side should always verify tokens properly.
 */

/**
 * Decode JWT token without verification (client-side only)
 * Returns decoded payload or null if invalid
 */
export function decodeToken(token) {
  try {
    if (!token) return null;
    
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token) {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * Verify admin token (client-side check)
 * Returns true if token exists and is not expired
 */
export function verifyAdminToken() {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("admin_token");
  if (!token) return false;

  // Check if token is expired
  if (isTokenExpired(token)) {
    localStorage.removeItem("admin_token");
    return false;
  }

  return true;
}

/**
 * Verify home admin token (client-side check)
 * Returns true if token exists and is not expired
 */
export function verifyHomeAdminToken() {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("homeAdminToken");
  if (!token) return false;

  // Check if token is expired
  if (isTokenExpired(token)) {
    localStorage.removeItem("homeAdminToken");
    localStorage.removeItem("homeAdmin");
    return false;
  }

  // Verify role in token
  const decoded = decodeToken(token);
  if (decoded && decoded.role !== "home-admin") {
    return false;
  }

  return true;
}

/**
 * Get admin token from localStorage
 */
export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

/**
 * Get home admin token from localStorage
 */
export function getHomeAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("homeAdminToken");
}








