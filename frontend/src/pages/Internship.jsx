import { useState } from "react";
import { BookOpen, Laptop, Paperclip, Send, Users } from "lucide-react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { submitInternshipApplication } from "../lib/api";

const WHATSAPP_NUMBER = "919891967200";

const PERKS = [
  { icon: BookOpen, title: "Real Casework", desc: "Assist on live matters before the Delhi High Court and subordinate courts." },
  { icon: Users, title: "Direct Mentorship", desc: "Work alongside advocates with 6–30 years of courtroom experience." },
  { icon: Laptop, title: "Online, Offline, or Hybrid", desc: "Flexible internship mode to fit your college schedule." },
];

const initialForm = {
  firstName: "",
  surname: "",
  preferredName: "",
  college: "",
  email: "",
  contact: "",
  gender: "",
  mode: "",
  dob: "",
  month: "",
};

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--fg-muted)]">{label}</span>
      {children}
    </label>
  );
}

export default function Internship() {
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setResumeError("");
      setResume(null);
      return;
    }

    // file.type/extension is inferred from the filename, not the content — a
    // .docx renamed to .pdf still reports as "application/pdf" here, so the
    // only reliable check is the file's own magic-number header.
    const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    const isPdf = String.fromCharCode(...header) === "%PDF-";
    if (!isPdf) {
      setResumeError("Please upload a valid PDF file.");
      setResume(null);
      e.target.value = "";
      return;
    }
    setResumeError("");
    setResume(file);
  };

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (resume) formData.append("resume", resume);
    submitInternshipApplication(formData);

    const lines = [
      "New internship application via website:",
      "",
      `Name: ${form.firstName} ${form.surname} (${form.preferredName || "—"})`,
      `College: ${form.college}`,
      `Email: ${form.email}`,
      `Contact: ${form.contact}`,
      `Gender: ${form.gender}`,
      `Mode of Internship: ${form.mode}`,
      `DOB: ${form.dob}`,
      `Preferred month: ${form.month}`,
      "",
      resume ? `Resume attached via website: ${resume.name}` : "(Please share your CV as a PDF in this chat.)",
    ].join("\n");
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(lines)}`, "_blank", "noopener");
  };

  const inputClass =
    "rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] w-full";
  const inputStyle = { borderColor: "var(--line)", background: "var(--card)" };

  return (
    <Layout>
      <PageHeader
        kicker="Join Us"
        title="Internship Program"
        note="Work on real matters, learn directly from practicing advocates, and get hands-on courtroom exposure."
        image="/images/practice-areas/insurance-law.jpg"
      />

      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-14">
          <Reveal>
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--fg-muted)]">
              Why Intern With Us
            </span>
            <h2 className="font-display font-bold uppercase leading-[1.02] text-[clamp(1.8rem,4vw,2.6rem)] mt-2">
              Learn where the work happens.
            </h2>
            <div className="mt-8 flex flex-col gap-5">
              {PERKS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
                  >
                    <Icon size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">{title}</h3>
                    <p className="text-[var(--fg-muted)] text-sm mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={submit}
              className="hover-pop rounded-2xl border p-7 sm:p-9 flex flex-col gap-4"
              style={{ borderColor: "var(--line)", background: "var(--card)" }}
            >
              <h2 className="font-display font-bold text-xl mb-1">Application Form</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First Name">
                  <input required placeholder="Enter your first name" value={form.firstName} onChange={update("firstName")} className={inputClass} style={inputStyle} />
                </Field>
                <Field label="Surname">
                  <input required placeholder="Enter your surname" value={form.surname} onChange={update("surname")} className={inputClass} style={inputStyle} />
                </Field>
              </div>

              <Field label="Preferred Name (optional)">
                <input placeholder="Enter your preferred name" value={form.preferredName} onChange={update("preferredName")} className={inputClass} style={inputStyle} />
              </Field>

              <Field label="College / University">
                <input required placeholder="Enter your college name" value={form.college} onChange={update("college")} className={inputClass} style={inputStyle} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <input required type="email" placeholder="Enter your email" value={form.email} onChange={update("email")} className={inputClass} style={inputStyle} />
                </Field>
                <Field label="Contact Number">
                  <input required type="tel" placeholder="Enter your number" value={form.contact} onChange={update("contact")} className={inputClass} style={inputStyle} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Gender">
                  <select required value={form.gender} onChange={update("gender")} className={inputClass} style={inputStyle}>
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Mode of Internship">
                  <select required value={form.mode} onChange={update("mode")} className={inputClass} style={inputStyle}>
                    <option value="" disabled>
                      Select mode
                    </option>
                    <option>Offline</option>
                    <option>Online</option>
                    <option>Hybrid</option>
                  </select>
                </Field>
                <Field label="Date of Birth">
                  <input required type="date" value={form.dob} onChange={update("dob")} className={inputClass} style={inputStyle} />
                </Field>
              </div>

              <Field label="Preferred Month of Internship">
                <input required placeholder="e.g. June 2026" value={form.month} onChange={update("month")} className={inputClass} style={inputStyle} />
              </Field>

              <Field label="Resume (PDF, optional)">
                <label
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer"
                  style={inputStyle}
                >
                  <Paperclip size={16} className="shrink-0 text-[var(--fg-muted)]" />
                  <span className={resume ? "" : "text-[var(--fg-muted)]"}>
                    {resume ? resume.name : "Upload your resume"}
                  </span>
                  <input type="file" accept="application/pdf" onChange={handleResumeChange} className="hidden" />
                </label>
              </Field>
              {resumeError && <p className="text-xs text-red-500 -mt-2">{resumeError}</p>}

              <button
                type="submit"
                className="flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-full px-7 py-3.5 mt-2"
                style={{ background: "var(--accent)", color: "var(--color-navy)" }}
              >
                <Send size={16} strokeWidth={2.4} />
                Submit via WhatsApp
              </button>
              <p className="text-xs text-[var(--fg-muted)]">
                This opens WhatsApp with your details pre-filled. If you didn't attach a resume above, please share your CV as a PDF in the chat.
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
