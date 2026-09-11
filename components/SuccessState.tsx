export function SuccessState() {
  return (
    <section className="success-state" aria-live="polite" aria-label="تم التسجيل بنجاح">
      <div className="success-check" aria-hidden="true">
        <span>✓</span>
      </div>
      <h2>تم التسجيل</h2>
    </section>
  );
}