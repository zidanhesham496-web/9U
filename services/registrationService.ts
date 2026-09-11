export type RegistrationRecord = {
  id: string;
  name: string;
  nationalId: string;
  college: string;
  phone: string;
  talent: string;
  createdAt: string;
};

export type RegistrationInput = Omit<RegistrationRecord, "id" | "createdAt">;

export type RegistrationReceipt = Pick<RegistrationRecord, "id" | "createdAt">;

import { getApiUrl } from "@/services/apiConfig";

export async function registerTalent(data: RegistrationInput): Promise<RegistrationReceipt> {
  const response = await fetch(getApiUrl("/api/registrations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Registration request failed");
  }

  return (await response.json()) as RegistrationReceipt;
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const response = await fetch(getApiUrl("/api/registrations"), {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Registration request failed");
  }

  return (await response.json()) as RegistrationRecord[];
}