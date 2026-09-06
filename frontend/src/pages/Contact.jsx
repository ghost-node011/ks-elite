import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { submitLead } from "../lib/api";
import { isValidPhone } from "../lib/validators";

const OFFICES = [
  "45/1109, 1st Floor, DDA Flats, Kalkaji, Delhi-110019",
  "Chamber No. 825, Lawyer's Block, Saket, Delhi",
  "G-14, Opposite Anjali Jeweller, Kalkaji, New Delhi",
];

const PHONE = "+91 94670 45415";
const PHONE_TEL = "+919467045415";
const EMAIL = "support@kseliteattorneys.com";
const WHATSAPP_NUMBER = "919891967200";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", matter: "", message: "" });
  const [phoneError, setPhoneError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!isValidPhone(form.phone)) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setPhoneError("");
    submitLead("contact", form);
    const text = `New consultation request via website:%0A%0AName: ${encodeURIComponent(form.name)}%0APhone: ${encodeURIComponent(
      form.phone
    )}%0AMatter: ${encodeURIComponent(form.matter)}%0AMessage: ${encodeURIComponent(form.message)}`;
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`, "_blank", "noopener");
  };

  return (
    <Layout>
      <PageHeader
        kicker="Let's Talk"
        title="Speak with an advocate today."
        note="Consultations available 24/7. Reach out by phone, WhatsApp, or the form below — or visit us at any of our three Delhi offices."
        image="/images/practice-areas/adr.jpg"
      />

      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-14">
          <Reveal>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <h2 className="font-display font-bold text-2xl mb-2">Request a Consultation</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Full name"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--line)", background: "var(--card)" }}
                />
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="Phone number"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--line)", background: "var(--card)" }}
                />
              </div>
              {phoneError && <p className="text-xs text-red-500 -mt-2">{phoneError}</p>}

              <input
                value={form.matter}
                onChange={update("matter")}
                placeholder="Nature of matter (e.g. Criminal, Property, Family)"
                className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                style={{ borderColor: "var(--line)", background: "var(--card)" }}
              />

              <textarea
                required
                value={form.message}
                onChange={update("message")}
                placeholder="Briefly describe your matter"
                rows={5}
                className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] resize-none"
                style={{ borderColor: "var(--line)", background: "var(--card)" }}
              />

              <button
                type="submit"
                className="hover-pop flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-full px-7 py-3.5 mt-2"
                style={{ background: "var(--accent)", color: "var(--color-navy)", borderColor: "var(--accent)", borderWidth: 1.5 }}
              >
                <Send size={16} strokeWidth={2.4} />
                Send via WhatsApp
              </button>
              <p className="text-xs text-[var(--fg-muted)]">
                This opens WhatsApp with your message pre-filled so our team can respond directly.
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-4">
            <div className="hover-pop rounded-2xl border p-6" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-2">
                <Phone size={16} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)]">Phone</span>
              </div>
              <a href={`tel:${PHONE_TEL}`} className="font-display font-semibold text-lg">
                {PHONE}
              </a>
            </div>

            <div className="hover-pop rounded-2xl border p-6" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-2">
                <Mail size={16} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)]">Email</span>
              </div>
              <a href={`mailto:${EMAIL}`} className="font-display font-semibold text-lg break-all">
                {EMAIL}
              </a>
            </div>

            <div className="hover-pop rounded-2xl border p-6" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle size={16} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)]">WhatsApp</span>
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="font-display font-semibold text-lg"
              >
                Message us directly
              </a>
            </div>

            <div className="hover-pop rounded-2xl border p-6" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={16} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)]">Offices</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {OFFICES.map((o) => (
                  <p key={o} className="text-sm leading-relaxed text-[var(--fg-muted)]">
                    {o}
                  </p>
                ))}
              </div>
            </div>

            <div className="hover-pop rounded-2xl border p-6" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-2">
                <Clock size={16} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)]">Office Hours</span>
              </div>
              <p className="text-sm text-[var(--fg-muted)]">Mon – Fri, 9:00 AM – 6:00 PM · Consultations available 24/7</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal as="section" className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden border" style={{ borderColor: "var(--line)" }}>
          <iframe
            title="K.S. Elite Attorneys — Kalkaji, New Delhi"
            src="https://maps.google.com/maps?q=Kalkaji%2C%20New%20Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="360"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </Layout>
  );
}
