"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select, SelectOption } from "@/components/Select";
import { SuccessState } from "@/components/SuccessState";
import { registerTalent } from "@/services/registrationService";

type FormValues = {
  fullName: string;
  college: string;
  phone: string;
  talent: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const talentOptions: SelectOption[] = [
  { label: "غناء", value: "singing" },
  { label: "تمثيل", value: "acting" },
  { label: "أداء", value: "performance" },
  { label: "كتابة سيناريو", value: "script-writing" },
  { label: "كتابة شعر", value: "poetry-writing" },
  { label: "إلقاء شعر", value: "poetry-recitation" },
];

const initialValues: FormValues = {
  fullName: "",
  college: "",
  phone: "",
  talent: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.fullName.trim()) {
    errors.fullName = "يرجى إدخال الاسم الكامل.";
  }

  if (!values.college.trim()) {
    errors.college = "يرجى إدخال الكلية أو التخصص.";
  }

  if (!values.phone.trim()) {
    errors.phone = "يرجى إدخال رقم الهاتف.";
  } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح من 7 إلى 15 رقمًا.";
  }

  if (!values.talent) {
    errors.talent = "يرجى اختيار الموهبة.";
  }

  return errors;
}

export function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);

    setErrors(nextErrors);
    setSubmissionError("");

    if (Object.keys(nextErrors).length === 0 && !isSaving) {
      setIsSaving(true);

      try {
        const savedRecord = await registerTalent({
          name: values.fullName,
          college: values.college,
          phone: values.phone,
          talent: values.talent,
        });

        console.log(savedRecord);
        setIsSubmitted(true);
      } catch {
        setSubmissionError("تعذر حفظ التسجيل. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsSaving(false);
      }
    }
  }

  return (
    <div className={`registration-stage ${isSubmitted ? "is-submitted" : ""}`.trim()}>
      <form
        className="registration-form registration-panel"
        noValidate
        onSubmit={handleSubmit}
        aria-hidden={isSubmitted}
      >
        <div className="form-fields">
          <Input
            label="الاسم الكامل"
            name="fullName"
            autoComplete="name"
            required
            value={values.fullName}
            error={errors.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
          <Input
            label="الكلية أو التخصص"
            name="college"
            autoComplete="organization"
            required
            value={values.college}
            error={errors.college}
            onChange={(event) => updateField("college", event.target.value)}
          />
          <Input
            label="رقم الهاتف"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={values.phone}
            error={errors.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
          <Select
            label="الموهبة"
            name="talent"
            required
            options={talentOptions}
            value={values.talent}
            error={errors.talent}
            onChange={(event) => updateField("talent", event.target.value)}
          />
        </div>

        {submissionError && (
          <p className="submission-error" role="alert">
            {submissionError}
          </p>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "جارٍ إتمام التسجيل..." : "إتمام التسجيل"}
        </Button>
      </form>
      <SuccessState />
    </div>
  );
}