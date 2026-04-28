import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import api from "../lib/api";
import { toast } from "sonner";
import { ArrowLeft, Plane } from "lucide-react";

export default function NewItinerary() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    traveler_name: "",
    destination_country: "",
    destination_city: "",
    purpose: "Business",
    start_date: "",
    end_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/itineraries", form);
      toast.success("Itinerary created — running risk assessment");
      try { await api.post(`/itineraries/${res.data.id}/assess`); } catch (_) {}
      navigate(`/dashboard/itinerary/${res.data.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create itinerary");
    } finally { setLoading(false); }
  };

  return (
    <div data-testid="new-itinerary-page" className="bg-black min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <Link to="/dashboard" data-testid="new-back-btn" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to console
        </Link>

        <div className="mt-6 mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-3">// NEW ITINERARY</div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1]">
            Open a new mission file.
          </h1>
          <p className="text-sm text-zinc-400 mt-3 max-w-xl">
            Submit itinerary details to activate real-time threat monitoring and AI-driven risk assessment.
          </p>
        </div>

        <form onSubmit={onSubmit} data-testid="new-itinerary-form" className="border border-white/10 bg-[#0a0a0a] p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Traveler Name" testid="new-traveler" required value={form.traveler_name} onChange={onChange("traveler_name")} />
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">Purpose *</label>
              <select
                data-testid="new-purpose"
                value={form.purpose}
                onChange={onChange("purpose")}
                className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              >
                <option>Business</option>
                <option>Diplomatic</option>
                <option>Humanitarian / NGO</option>
                <option>Media / Journalism</option>
                <option>Government</option>
                <option>Tourism</option>
                <option>Executive Protection</option>
              </select>
            </div>
            <Field label="Destination City" testid="new-city" required value={form.destination_city} onChange={onChange("destination_city")} />
            <Field label="Destination Country" testid="new-country" required value={form.destination_country} onChange={onChange("destination_country")} />
            <Field label="Start Date" testid="new-start" type="date" required value={form.start_date} onChange={onChange("start_date")} />
            <Field label="End Date" testid="new-end" type="date" required value={form.end_date} onChange={onChange("end_date")} />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-2">Mission Notes</label>
            <textarea
              data-testid="new-notes"
              value={form.notes}
              onChange={onChange("notes")}
              rows={4}
              placeholder="Context, specific concerns, high-risk venues, VIP profile..."
              className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              AI ASSESSMENT WILL RUN AUTOMATICALLY
            </div>
            <button
              type="submit"
              data-testid="new-submit-btn"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {loading ? "Provisioning mission..." : (<>Activate monitoring <Plane className="h-4 w-4" /></>)}
            </button>
          </div>
        </form>
      </div>
      <Footer />
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
      onChange={onChange}
      className="w-full bg-black border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
    />
  </div>
);
