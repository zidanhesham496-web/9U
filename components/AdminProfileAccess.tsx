"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminLoginModal } from "@/components/AdminLoginModal";

export function AdminProfileAccess() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccess() {
    setIsOpen(false);
    router.push("/admin");
  }

  return (
    <>
      <button
        className="profile-button"
        type="button"
        aria-label="فتح دخول الإدارة"
        onClick={() => setIsOpen(true)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20c.8-3.2 3.1-5 6.5-5s5.7 1.8 6.5 5" />
        </svg>
      </button>
      <AdminLoginModal open={isOpen} onClose={() => setIsOpen(false)} onSuccess={handleSuccess} />
    </>
  );
}