import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Shield, ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Access granted");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div data-testid="login-page" className="min-h-screen flex items-center justify-center bg-black px-6 relative">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md border border-white/10 bg-[#0a0a0a] p-10">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="h-9 w-9 border border-white/30 flex items-center justify-center bg-white/5">
            <Shield className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-sm tracking-tight text-white">GLOBAL INTEL DESK</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">Operator Access</span>
          </div>
        </Link>

        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">// AUTHENTICATE</div>
        <h1 className="font-display text-3xl font-black tracking-tight text-white mb-8">Sign in to the desk.</h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">Email</label>
            <input
              data-testid="login-email-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">Password</label>
            <input
              data-testid="login-password-input"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          >
            {loading ? "Verifying..." : (<>Access desk <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          No credentials?{" "}
          <Link to="/register" data-testid="login-to-register" className="text-white hover:underline">Request access</Link>
        </div>
      </div>
    </div>
  );
}
