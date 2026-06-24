import type { User } from "@/redux/slices/authSlice";

const AUTH_PROVIDER_KEY = "authProvider";

export type AuthProvider = "local" | "firebase";

export function markLocalAuthSession() {
  localStorage.setItem(AUTH_PROVIDER_KEY, "local");
}

export function markFirebaseAuthSession() {
  localStorage.setItem(AUTH_PROVIDER_KEY, "firebase");
}

export function clearAuthSessionMarker() {
  localStorage.removeItem(AUTH_PROVIDER_KEY);
}

export function isLocalAuthSession() {
  return localStorage.getItem(AUTH_PROVIDER_KEY) === "local";
}

export function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}
