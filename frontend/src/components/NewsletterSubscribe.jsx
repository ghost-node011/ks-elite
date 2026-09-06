import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { subscribeToNewsletter } from "../lib/api";
import { isValidEmail } from "../lib/validators";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      await subscribeToNewsletter(email);
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="mt-20 rounded-3xl border p-8 sm:p-12 text-center"
      style={{ borderColor: "var(--line)", background: "var(--color-navy)" }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "color-mix(in srgb, var(--color-gold) 18%, transparent)" }}
      >
        <Mail size={20} style={{ color: "var(--color-gold)" }} />
      </div>
      <h3 className="font-display font-bold text-xl sm:text-2xl" style={{ color: "var(--color-ivory)" }}>
        Get new articles in your inbox.
      </h3>
      <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: "rgba(247,244,236,0.65)" }}>
        No spam — just a note whenever we publish something new on courts, technology, and the law.
      </p>

      {status === "done" ? (
        <p className="mt-6 font-display font-semibold text-sm" style={{ color: "var(--color-gold-soft)" }}>
          You're subscribed. Thanks for reading.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-full border px-5 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
            style={{ borderColor: "rgba(247,244,236,0.2)", background: "rgba(247,244,236,0.06)", color: "var(--color-ivory)" }}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="hover-pop flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-full px-6 py-3 disabled:opacity-60"
            style={{ background: "var(--color-gold)", color: "var(--color-navy)" }}
          >
            <Send size={15} strokeWidth={2.4} />
            {status === "sending" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </div>
  );
}
