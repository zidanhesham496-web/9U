import { BackgroundEffects } from "@/components/BackgroundEffects";
import { AdminProfileAccess } from "@/components/AdminProfileAccess";
import { GlassCard } from "@/components/GlassCard";
import { RegistrationForm } from "@/components/RegistrationForm";
import Image from "next/image";

export default function RegistrationPage() {
  return (
    <main className="page-shell relative isolate overflow-hidden">
      <BackgroundEffects />
      <AdminProfileAccess />
      <div className="brand-logos" aria-label="شعارات الجهات المنظمة">
        <div className="brand-logo brand-logo-left">
          <Image
            src="/file_00000000557c82108ae6f5bf3969b3b5.jpg"
            alt="مركز إعداد القادة - جامعة الإسماعيلية الجديدة الأهلية"
            width={1536}
            height={1439}
            priority
          />
        </div>
        <div className="brand-logo brand-logo-right">
          <Image
            src="/file_00000000fd1082108294e03512d8ee46.jpg"
            alt="NINU 2022"
            width={1536}
            height={1361}
            priority
          />
        </div>
      </div>
      <div className="registration-frame">
        <GlassCard className="registration-card relative z-10 w-full max-w-md">
          <div className="form-intro">
            <p className="eyebrow">NINU 2022</p>
            <h1>تسجيل بيانات الطالب</h1>
            <p>يرجى تعبئة البيانات التالية بدقة</p>
          </div>
          <RegistrationForm />
        </GlassCard>
      </div>
    </main>
  );
}