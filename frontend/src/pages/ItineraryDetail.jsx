import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import api from "../lib/api";
import { toast } from "sonner";
import { RiskBadge, RiskBar } from "../components/RiskBadge";
import {
  ArrowLeft, MapPin, CalendarDays, User, RefreshCw, Trash2, ShieldAlert,
  Phone, AlertTriangle, Loader2, Activity, BookOpen, Save, Radio
} from "lucide-react";

const sevBorder = (s) => ({
  LOW: "border-green-500/40",
  MODERATE: "border-yellow-500/40",
  HIGH: "border-orange-500/50",
  CRITICAL: "border-red-500/60",
}[s] || "border-white/10");

const sevText = (s) => ({
  LOW: "text-green-400",
  MODERATE: "text-yellow-400",
  HIGH: "text-orange-400",
  CRITICAL: "text-red-400",
}[s] || "text-white");

const EMERGENCY_PROTOCOLS = [
  { code: "P-01", t: "Medical emergency", d: "Contact 24/7 crisis line. Analyst will coordinate nearest vetted clinic, trauma center, or air-medical evacuation." },
  { code: "P-02", t: "Security threat / kidnap", d: "Trigger duress code via app. Operations team initiates extraction protocol with local assets and authorities." },
  { code: "P-03", t: "Civil unrest / political event", d: "Shelter-in-place at hardened lodging. Analyst tracks event perimeter and advises movement window." },
  { code: "P-04", t: "Natural disaster", d: "Follow evacuation order. Proceed to designated muster point. Desk provides live route intelligence." },
  { code: "P-05", t: "Detention / border issue", d: "Do not sign documents. Call legal hotline. Desk coordinates with consular services." },
];

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itin, setItin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [debrief, setDebrief] = useState("");
  const [savingDebrief, setSavingDebrief] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/itineraries/${id}`);
      setItin(res.data);
      setDebrief(res.data.debrief || "");
    } catch (e) {
      toast.error("Itinerary not found");
      navigate("/dashboard");
    } finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  const onAssess = async () => {
    setAssessing(true);
    try {
      const res = await api.post(`/itineraries/${id}/assess`);
      setItin(res.data);
      toast.success("Risk assessment complete");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Assessment failed");
    } finally { setAssessing(false); }
  };

  const onRefreshAlerts = async () => {
    setRefreshing(true);
    try {
      const res = await api.post(`/itineraries/${id}/refresh-alerts`);
      setItin(res.data);
      toast.success("Threat feed refreshed");
    } catch (e) {
      toast.error("Refresh failed");
    } finally { setRefreshing(false); }
  };

  const onSaveDebrief = async () => {
    setSavingDebrief(true);
    try {
      const res = await api.put(`/itineraries/${id}/debrief`, { debrief });
      setItin(res.data);
      toast.success("Debrief saved");
    } catch (e) {
      toast.error("Save failed");
    } finally { setSavingDebrief(false); }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this itinerary? This cannot be undone.")) return;
    try {
      await api.delete(`/itineraries/${id}`);
      toast.success("Itinerary deleted");
      navigate("/dashboard");
    } catch (e) { toast.error("Delete failed"); }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.25em]">LOADING MISSION</span>
        </div>
      </div>
    );
  }
  if (!itin) return null;

  return (
    <div data-testid="itinerary-detail-page" className="bg-black min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <Link to="/dashboard" data-testid="detail-back-btn" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Console
          </Link>

          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                MISSION · {itin.id.slice(0, 8).toUpperCase()}
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1]">
                {itin.destination_city}, {itin.destination_country}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-2 text-zinc-300"><User className="h-3.5 w-3.5" strokeWidth={1.5} /> {itin.traveler_name}</span>
                <span className="flex items-center gap-2 text-zinc-300"><MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> {itin.purpose}</span>
                <span className="flex items-center gap-2 text-zinc-300 font-mono"><CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} /> {itin.start_date} → {itin.end_date}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.25em] border px-2 py-0.5 ${
                  itin.status === "active" ? "border-green-500/50 text-green-400" :
                  itin.status === "planned" ? "border-white/20 text-zinc-300" : "border-white/10 text-zinc-500"
                }`}>{itin.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                data-testid="detail-assess-btn"
                onClick={onAssess}
                disabled={assessing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                {assessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                {itin.assessment ? "Re-assess" : "Run assessment"}
              </button>
              <button
                data-testid="detail-delete-btn"
                onClick={onDelete}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/40 text-red-400 font-mono text-xs uppercase tracking-[0.2em] hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-12 gap-4">
        {/* Risk assessment */}
        <section className="col-span-12 lg:col-span-8">
          <div className="border border-white/10 bg-[#0a0a0a]">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">// RISK PICTURE</div>
                <div className="font-display text-lg font-bold text-white">Assessment</div>
              </div>
              {itin.assessment && <RiskBadge level={itin.assessment.overall_level} />}
            </div>

            {assessing ? (
              <div className="p-16 flex items-center justify-center gap-3 text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-mono text-xs uppercase tracking-[0.25em]">ANALYSTS COMPILING BRIEFING...</span>
              </div>
            ) : !itin.assessment ? (
              <div className="p-12 text-center">
                <ShieldAlert className="h-8 w-8 mx-auto text-zinc-600 mb-3" strokeWidth={1.5} />
                <div className="font-display font-bold text-white mb-1">No assessment yet.</div>
                <div className="text-sm text-zinc-400">Run an intelligence assessment to generate a full risk picture.</div>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-white/10 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">OVERALL LEVEL</div>
                    <div className="mt-1 font-display text-2xl font-black text-white">{itin.assessment.overall_level}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">COMPOSITE SCORE</div>
                    <div className="mt-1 font-mono text-2xl font-medium text-white">{itin.assessment.overall_score}<span className="text-zinc-500 text-base">/100</span></div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">GENERATED</div>
                    <div className="mt-1 font-mono text-xs text-zinc-300">{new Date(itin.assessment.generated_at).toUTCString()}</div>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {itin.assessment.scores.map((s, i) => (
                    <div key={i} data-testid={`risk-score-${i}`} className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-display font-bold text-white">{s.category}</div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-zinc-300">{s.score}<span className="text-zinc-500 text-xs">/100</span></span>
                          <RiskBadge level={s.level} />
                        </div>
                      </div>
                      <RiskBar score={s.score} level={s.level} />
                      <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{s.summary}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-white/10 bg-[#080808]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// RECOMMENDATIONS</div>
                  <ul className="space-y-3">
                    {itin.assessment.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                        <span className="mt-1.5 h-1 w-4 bg-white flex-shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {itin.assessment.emergency_contacts.map((c, i) => (
                    <div key={i} className="border border-white/10 p-3 flex items-start gap-3">
                      <Phone className="h-4 w-4 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="text-xs text-zinc-300">{c}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Debrief */}
          <div className="mt-4 border border-white/10 bg-[#0a0a0a]">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">// POST-TRAVEL DEBRIEF</div>
                <div className="font-display text-lg font-bold text-white flex items-center gap-2"><BookOpen className="h-4 w-4" /> Incident log & notes</div>
              </div>
              <button
                data-testid="detail-save-debrief-btn"
                onClick={onSaveDebrief}
                disabled={savingDebrief}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black disabled:opacity-50 transition-colors"
              >
                <Save className="h-3.5 w-3.5" /> {savingDebrief ? "Saving..." : "Save"}
              </button>
            </div>
            <textarea
              data-testid="detail-debrief-textarea"
              value={debrief}
              onChange={(e) => setDebrief(e.target.value)}
              rows={6}
              placeholder="Record incidents, near-misses, local asset feedback, protocol refinements..."
              className="w-full bg-black text-white px-5 py-4 text-sm focus:outline-none resize-none"
            />
          </div>
        </section>

        {/* Alerts + protocols */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="border border-white/10 bg-[#0a0a0a]">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">// THREAT FEED</div>
                <div className="font-display text-lg font-bold text-white flex items-center gap-2"><Radio className="h-4 w-4 text-red-400" /> Live alerts</div>
              </div>
              <button
                data-testid="detail-refresh-alerts-btn"
                onClick={onRefreshAlerts}
                disabled={refreshing}
                className="p-2 border border-white/15 text-white hover:bg-white hover:text-black disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto">
              {(itin.alerts || []).length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500">
                  No alerts yet. Run an assessment to generate feed.
                </div>
              ) : itin.alerts.map((a) => (
                <div key={a.id} data-testid={`threat-alert-${a.id}`} className={`p-4 border-l-2 ${sevBorder(a.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${sevText(a.severity)}`}>[{a.severity}] {a.category}</span>
                    <span className="font-mono text-[9px] text-zinc-500">{new Date(a.timestamp).toUTCString().slice(17, 22)}</span>
                  </div>
                  <div className="text-sm font-semibold text-white leading-tight">{a.headline}</div>
                  <div className="mt-1 text-xs text-zinc-400 leading-relaxed">{a.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#0a0a0a]">
            <div className="p-5 border-b border-white/10">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">// EMERGENCY PROTOCOLS</div>
              <div className="font-display text-lg font-bold text-white flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Response playbooks</div>
            </div>
            <div className="divide-y divide-white/10">
              {EMERGENCY_PROTOCOLS.map((p) => (
                <div key={p.code} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-display font-bold text-white text-sm">{p.t}</div>
                    <span className="font-mono text-[10px] text-zinc-500">{p.code}</span>
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">{p.d}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 bg-black flex items-center gap-3">
              <Phone className="h-4 w-4 text-red-400" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">24/7 CRISIS LINE</div>
                <div className="font-display font-bold text-white text-sm">+1 (800) 555-0198</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
