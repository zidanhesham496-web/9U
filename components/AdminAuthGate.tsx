"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { GlassCard } from "@/components/GlassCard";
import { hasAdminSession } from "@/services/adminAuth";

export function AdminAuthGate() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    void hasAdminSession().then(setIsAuthenticated).catch(() => setIsAuthenticated(false));
  }, []);

  function handleSuccess() {
    setIsAuthenticated(true);
  }

  if (isAuthenticated === null) {
    return <main className="admin-shell" aria-busy="true" />;
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-shell admin-auth-shell">
        <BackgroundEffects />
        <GlassCard className="admin-auth-placeholder">
          <p className="eyebrow">9U / لوحة الإدارة</p>
          <p>يجب تسجيل الدخول للوصول إلى هذه الصفحة.</p>
        </GlassCard>
        <AdminLoginModal open onClose={() => router.push("/")} onSuccess={handleSuccess} />
      </main>
    );
  }

  return <AdminDashboard />;
}