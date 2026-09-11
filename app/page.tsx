import { BackgroundEffects } from "@/components/BackgroundEffects";
import { AdminProfileAccess } from "@/components/AdminProfileAccess";
import { GlassCard } from "@/components/GlassCard";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="page-shell relative isolate overflow-hidden">
      <BackgroundEffects />
      <AdminProfileAccess />
      <div className="registration-frame">
        <GlassCard className="registration-card relative z-10 w-full max-w-md">
          <div className="card-brand" aria-label="9U">
            9U
          </div>
          <RegistrationForm />
        </GlassCard>
      </div>
    </main>
  );
}