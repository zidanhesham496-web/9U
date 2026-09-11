"use client";

import { FormEvent, useState } from "react";
import { validateAdminCredentials } from "@/services/adminAuth";

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AdminLoginModal({ open, onClose, onSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (await validateAdminCredentials(username.trim(), password)) {
        setError("");
        onSuccess();
        return;
      }
    } catch {
      setError("تعذر الاتصال بخدمة الدخول. يرجى المحاولة مرة أخرى.");
      return;
    }

    setError("اسم المستخدم أو كلمة المرور غير صحيحة.");
  }

  return (
    <div className="auth-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="auth-modal-close" type="button" aria-label="إغلاق" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <p className="eyebrow">9U / دخول الإدارة</p>
        <h2 id="admin-login-title">مرحبًا بعودتك</h2>
        <p className="auth-modal-copy">أدخل بيانات الإدارة للوصول إلى التسجيلات.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span className="field-label">اسم المستخدم</span>
            <input
              className="field-control"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              autoFocus
              required
            />
          </label>
          <label className="field-group">
            <span className="field-label">كلمة المرور</span>
            <input
              className="field-control"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="auth-actions">
            <button className="auth-cancel" type="button" onClick={onClose}>إلغاء</button>
            <button className="auth-submit" type="submit">دخول</button>
          </div>
        </form>
      </section>
    </div>
  );
}