import React, { useState } from "react";
import { Footer } from "../components/Footer";
import api from "../lib/api";
import { toast } from "sonner";
import { Send, Mail, Phone, Building2 } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Name, email, and message are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      toast.success("Message received. An analyst will respond shortly.");
      setForm({ name: "", email: "", company: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page" className="bg-black">
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-b border-white/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-5">// CONTACT</div>
        <h1 className="font-display text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
          Open a channel.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          For briefings, retainers, or active-threat inquiries, reach the desk below. Typical response
          within one business hour. For life-threatening emergencies, call the crisis line directly.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-5 space-y-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">CRISIS LINE</div>
            <div className="font-display text-3xl font-black text-white">+1 (800) 555-0198</div>
            <div className="text-xs text-zinc-400 mt-1">Monitored 24 · 7 · 365 — analyst in under 30s.</div>
          </div>

          <div className="border border-white/10 divide-y divide-white/10">
            <div className="flex items-start gap-4 p-5">
              <Mail className="h-5 w-5 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">OPERATIONS</div>
                <div className="text-sm text-zinc-200">ops@globalinteldesk.com</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <Phone className="h-5 w-5 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">SECURE LINE</div>
                <div className="text-sm text-zinc-200">+1 (800) 555-0198</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <Building2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">OFFICES</div>
                <div className="text-sm text-zinc-200">Washington, DC · London · Singapore</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          {submitted ? (
            <div data-testid="contact-success" className="border border-green-500/30 bg-green-500/5 p-10 text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400 mb-3">MESSAGE RECEIVED</div>
              <div className="font-display text-2xl font-bold text-white mb-2">Channel open.</div>
              <p className="text-sm text-zinc-400">An analyst will respond to you shortly.</p>
              <button
                data-testid="contact-send-another"
                onClick={() => setSubmitted(false)}
                className="mt-6 px-5 py-2 border border-white/20 font-mono text-xs uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} data-testid="contact-form" className="border border-white/10 p-8 space-y-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">// SECURE INQUIRY</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Full Name" testid="contact-name" value={form.name} onChange={onChange("name")} required />
                <FormField label="Email" testid="contact-email" type="email" value={form.email} onChange={onChange("email")} required />
                <FormField label="Company / Organization" testid="contact-company" value={form.company} onChange={onChange("company")} />
                <FormField label="Phone" testid="contact-phone" value={form.phone} onChange={onChange("phone")} />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">Message *</label>
                <textarea
                  data-testid="contact-message"
                  value={form.message}
                  onChange={onChange("message")}
                  required
                  rows={6}
                  className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none"
                  placeholder="Tell us about your travelers, destinations, and timing..."
                />
              </div>
              <button
                type="submit"
                data-testid="contact-submit-btn"
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Transmitting..." : (<>Transmit inquiry <Send className="h-4 w-4" /></>)}
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const FormField = ({ label, testid, type = "text", value, onChange, required }) => (
  <div>
    <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">
      {label} {required && "*"}
    </label>
    <input
      data-testid={testid}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
    />
  </div>
);
