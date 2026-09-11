"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlassCard } from "@/components/GlassCard";
import { downloadRegistrationsCsv } from "@/services/exportService";
import {
  getAllRegistrations,
  RegistrationRecord,
} from "@/services/registrationService";

type SortOption = "newest" | "oldest" | "name";

const talentLabels: Record<string, string> = {
  singing: "غناء",
  acting: "تمثيل",
  performance: "أداء",
  "script-writing": "كتابة سيناريو",
  "poetry-writing": "كتابة شعر",
  "poetry-recitation": "إلقاء شعر",
};

const talentFilters = [
  { label: "كل المواهب", value: "all" },
  ...Object.entries(talentLabels).map(([value, label]) => ({ label, value })),
];

function formatRegistrationTime(timestamp: string) {
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function getTalentLabel(talent: string) {
  return talentLabels[talent] ?? talent;
}

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [talentFilter, setTalentFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRegistrations() {
      try {
        const records = await getAllRegistrations();
        if (isMounted) {
          setRegistrations(records);
        }
      } catch {
        if (isMounted) {
          setLoadError("تعذر تحميل التسجيلات. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadRegistrations();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleRegistrations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return registrations
      .filter((registration) => {
        const matchesSearch =
          !normalizedQuery ||
          registration.name.toLowerCase().includes(normalizedQuery) ||
          registration.college.toLowerCase().includes(normalizedQuery);
        const matchesTalent = talentFilter === "all" || registration.talent === talentFilter;

        return matchesSearch && matchesTalent;
      })
      .sort((first, second) => {
        if (sortOption === "name") {
          return first.name.localeCompare(second.name);
        }

        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();
        return sortOption === "newest" ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [registrations, searchQuery, sortOption, talentFilter]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  function handleExport() {
    downloadRegistrationsCsv(registrations);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="admin-shell">
      <BackgroundEffects />
      <GlassCard className="admin-card">
        <header className="admin-header">
          <div>
            <p className="eyebrow">9U / لوحة الإدارة</p>
            <h1>التسجيلات</h1>
            <p>راجع المواهب المستعدة للصعود إلى خشبة المسرح وأدر بياناتها.</p>
          </div>
          <div className="admin-header-actions">
            <div className="admin-total" aria-label={`${registrations.length} تسجيلات إجمالًا`}>
              <span>{registrations.length}</span>
              <small>إجمالي التسجيلات</small>
            </div>
            <div className="admin-actions">
              <button className="admin-action admin-action-secondary" type="button" onClick={handlePrint}>
                طباعة
              </button>
              <button className="admin-action admin-action-primary" type="button" onClick={handleExport}>
                تصدير إلى إكسل
              </button>
            </div>
          </div>
        </header>

        <div className="admin-toolbar" aria-label="أدوات تصفية التسجيلات">
          <label className="admin-search">
            <span className="sr-only">البحث بالاسم أو الكلية</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              className="field-control"
              type="search"
              placeholder="ابحث بالاسم أو الكلية"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </label>
          <label className="admin-filter">
            <span className="sr-only">تصفية حسب الموهبة</span>
            <select
              className="field-control field-select"
              value={talentFilter}
              onChange={(event) => setTalentFilter(event.target.value)}
            >
              {talentFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-filter">
            <span className="sr-only">ترتيب التسجيلات</span>
            <select
              className="field-control field-select"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
            >
              <option value="newest">الأحدث أولًا</option>
              <option value="oldest">الأقدم أولًا</option>
              <option value="name">الاسم أبجديًا</option>
            </select>
          </label>
        </div>

        {isLoading && <div className="admin-feedback">جارٍ تحميل التسجيلات...</div>}
        {!isLoading && loadError && <div className="admin-feedback admin-feedback-error">{loadError}</div>}
        {!isLoading && !loadError && registrations.length === 0 && (
          <div className="admin-empty">
            <span className="admin-empty-mark" aria-hidden="true">○</span>
            <h2>لا توجد تسجيلات بعد</h2>
            <p>ستظهر المواهب الجديدة هنا بعد إتمام نموذج التسجيل.</p>
          </div>
        )}
        {!isLoading && !loadError && registrations.length > 0 && visibleRegistrations.length === 0 && (
          <div className="admin-feedback">لا توجد تسجيلات تطابق خيارات التصفية.</div>
        )}
        {!isLoading && !loadError && visibleRegistrations.length > 0 && (
          <div className="registration-table-wrap">
            <table className="registration-table">
              <thead>
                <tr>
                  <th scope="col">الاسم</th>
                  <th scope="col">الرقم القومي</th>
                  <th scope="col">الكلية أو التخصص</th>
                  <th scope="col">رقم الهاتف</th>
                  <th scope="col">الموهبة</th>
                  <th scope="col">وقت التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {visibleRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td data-label="الاسم">{registration.name}</td>
                    <td data-label="الرقم القومي">{registration.nationalId}</td>
                    <td data-label="الكلية أو التخصص">{registration.college}</td>
                    <td data-label="رقم الهاتف">{registration.phone}</td>
                    <td data-label="الموهبة"><span className="talent-pill">{getTalentLabel(registration.talent)}</span></td>
                    <td data-label="وقت التسجيل">{formatRegistrationTime(registration.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </main>
  );
}