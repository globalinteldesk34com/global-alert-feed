import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Shield, ArrowRight } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", organization: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Access granted — welcome to the desk");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div data-testid="register-page" className="min-h-screen flex items-center justify-center bg-black px-6 py-10 relative">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md border border-white/10 bg-[#0a0a0a] p-10">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="h-9 w-9 border border-white/30 flex items-center justify-center bg-white/5">
            <Shield className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-sm tracking-tight text-white">GLOBAL INTEL DESK</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">New Operator</span>
          </div>
        </Link>

        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">// REQUEST ACCESS</div>
        <h1 className="font-display text-3xl font-black tracking-tight text-white mb-8">Create operator account.</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field testid="register-fullname-input" label="Full Name" required
            value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <Field testid="register-org-input" label="Organization"
            value={form.organization} onChange={(v) => setForm({ ...form, organization: v })} />
          <Field testid="register-email-input" label="Email" type="email" required
            value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field testid="register-password-input" label="Password (min 6)" type="password" required
            value={form.password} onChange={(v) => setForm({ ...form, password: v })} />

          <button
            type="submit"
            data-testid="register-submit-btn"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? "Provisioning..." : (<>Activate account <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Already cleared?{" "}
          <Link to="/login" data-testid="register-to-login" className="text-white hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, testid, type = "text", required, value, onChange }) => (
  <div>
    <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">
      {label} {required && "*"}
    </label>
    <input
      data-testid={testid}
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
    />
  </div>
);
