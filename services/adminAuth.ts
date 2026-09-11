import { getApiUrl } from "@/services/apiConfig";

export async function validateAdminCredentials(username: string, password: string) {
  const response = await fetch(getApiUrl("/api/admin/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (response.status >= 500) {
    throw new Error("Admin service unavailable");
  }

  return response.ok;
}

export async function hasAdminSession() {
  const response = await fetch(getApiUrl("/api/admin/session"), {
    credentials: "include",
    cache: "no-store",
  });

  return response.ok;
}