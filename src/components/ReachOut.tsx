import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./ReachOut.module.css";

type FormValues = {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  reason: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type TouchedFields = Partial<Record<keyof FormValues, boolean>>;

function ReachOut() {
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    countryCode: "",
    phoneNumber: "",
    email: "",
    purpose: "",
    reason: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validate = (formValues: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    const cleanedPhone = formValues.phoneNumber.replace(/\D/g, "");

    if (formValues.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter at least 2 characters.";
    }

    if (!formValues.countryCode) {
      nextErrors.countryCode = "Please select a country code.";
    }

    if (cleanedPhone.length < 7 || cleanedPhone.length > 15) {
      nextErrors.phoneNumber = "Phone number should be 7 to 15 digits.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formValues.purpose) {
      nextErrors.purpose = "Please select a purpose.";
    }

    if (formValues.reason.trim().length < 10) {
      nextErrors.reason = "Please provide at least 10 characters.";
    }

    return nextErrors;
  };

  const handleChange =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const rawValue = event.target.value;
      const nextValue = field === "phoneNumber" ? rawValue.replace(/\D/g, "") : rawValue;
      const newValues = { ...values, [field]: nextValue };
      setValues(newValues);
      if (submitStatus !== "idle") {
        setSubmitStatus("idle");
        setSubmitMessage("");
      }
      if (touched[field]) {
        setErrors(validate(newValues));
      }
    };

  const handleBlur = (field: keyof FormValues) => () => {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validate(values));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setTouched({
      fullName: true,
      countryCode: true,
      phoneNumber: true,
      email: true,
      purpose: true,
      reason: true,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitStatus("sending");
    setSubmitMessage("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseText = await response.text();
      let result: { message?: string } = {};
      if (responseText) {
        try {
          result = JSON.parse(responseText) as { message?: string };
        } catch {
          result = { message: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Unable to send message right now.");
      }

      setValues({
        fullName: "",
        countryCode: "",
        phoneNumber: "",
        email: "",
        purpose: "",
        reason: "",
      });
      setTouched({});
      setErrors({});
      setSubmitStatus("success");
      setSubmitMessage("Message sent successfully. I will get back to you soon.");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Unable to send message right now.");
    }
  };

  return (
    <section id="reach-out" className="section">
      <div className="section-title">
        <span className="section-icon">📨</span>
        Reach Me Out
      </div>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={values.fullName}
              onChange={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              disabled={submitStatus === "sending"}
              required
            />
            <span className={`${styles.errorText} ${!(touched.fullName && errors.fullName) ? styles.errorHidden : ""}`}>
              {touched.fullName && errors.fullName ? errors.fullName : "placeholder"}
            </span>
          </label>

          <div className={styles.field}>
            <span>Phone Number</span>
            <div className={styles.phoneWrap}>
              <select
                name="countryCode"
                aria-label="Country code"
                value={values.countryCode}
                onChange={handleChange("countryCode")}
                onBlur={handleBlur("countryCode")}
                disabled={submitStatus === "sending"}
                required
              >
                <option value="" disabled>
                  Code
                </option>
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (US/Canada)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (Australia)</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={values.phoneNumber}
                onChange={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                inputMode="numeric"
                pattern="[0-9]{7,15}"
                maxLength={15}
                disabled={submitStatus === "sending"}
                required
              />
            </div>
            <span
              className={`${styles.errorText} ${
                !(touched.countryCode && errors.countryCode) && !(touched.phoneNumber && errors.phoneNumber)
                  ? styles.errorHidden
                  : ""
              }`}
            >
              {touched.countryCode && errors.countryCode
                ? errors.countryCode
                : touched.phoneNumber && errors.phoneNumber
                  ? errors.phoneNumber
                  : "placeholder"}
            </span>
          </div>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              disabled={submitStatus === "sending"}
              required
            />
            <span className={`${styles.errorText} ${!(touched.email && errors.email) ? styles.errorHidden : ""}`}>
              {touched.email && errors.email ? errors.email : "placeholder"}
            </span>
          </label>

          <label className={styles.field}>
            <span>Purpose</span>
            <select
              name="purpose"
              required
              value={values.purpose}
              onChange={handleChange("purpose")}
              onBlur={handleBlur("purpose")}
              disabled={submitStatus === "sending"}
            >
              <option value="" disabled>
                Select reason category
              </option>
              <option value="job-opportunity">Job Opportunity</option>
              <option value="freelance-project">Freelance Project</option>
              <option value="collaboration">Collaboration</option>
              <option value="general-inquiry">General Inquiry</option>
            </select>
            <span className={`${styles.errorText} ${!(touched.purpose && errors.purpose) ? styles.errorHidden : ""}`}>
              {touched.purpose && errors.purpose ? errors.purpose : "placeholder"}
            </span>
          </label>
        </div>

        <label className={styles.field}>
          <span>Reason to Reach Me Out</span>
          <textarea
            name="reason"
            rows={5}
            placeholder="Write your message..."
            value={values.reason}
            onChange={handleChange("reason")}
            onBlur={handleBlur("reason")}
            disabled={submitStatus === "sending"}
            required
          />
          <span className={`${styles.errorText} ${!(touched.reason && errors.reason) ? styles.errorHidden : ""}`}>
            {touched.reason && errors.reason ? errors.reason : "placeholder"}
          </span>
        </label>

        <div className={styles.submitRow}>
          <button className={styles.submitBtn} type="submit" disabled={submitStatus === "sending"}>
            {submitStatus === "sending" ? "Sending..." : "Submit"}
          </button>
          {submitMessage ? (
            <span className={`${styles.statusText} ${submitStatus === "error" ? styles.statusError : ""}`}>
              {submitMessage}
            </span>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default ReachOut;
