import type { RegistrationRecord } from "@/services/registrationService";

const exportHeaders = ["Name", "National ID", "College", "Phone", "Talent", "Registration Time"];

const talentLabels: Record<string, string> = {
  singing: "Singing",
  acting: "Acting",
  performance: "Performance",
  "script-writing": "Script Writing",
  "poetry-writing": "Poetry Writing",
  "poetry-recitation": "Poetry Recitation",
};

function formatRegistrationTime(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function createRegistrationsCsv(records: RegistrationRecord[]) {
  const rows = records.map((record) => [
    record.name,
    record.nationalId,
    record.college,
    record.phone,
    talentLabels[record.talent] ?? record.talent,
    formatRegistrationTime(record.createdAt),
  ]);

  return [
    exportHeaders,
    ...rows,
  ]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n");
}

export function downloadRegistrationsCsv(records: RegistrationRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  const csv = `\uFEFF${createRegistrationsCsv(records)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = downloadUrl;
  link.download = `talent-registrations-${date}.csv`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}