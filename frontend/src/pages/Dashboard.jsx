import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useAuth } from "../lib/auth";
import api from "../lib/api";
import { RiskBadge } from "../components/RiskBadge";
import { Plus, MapPin, CalendarDays, Plane, Activity, AlertTriangle, ShieldCheck, Loader2, Radio } from "lucide-react";

const statusStyle = (s) => ({
  planned: { t: "text-zinc-300", b: "border-zinc-600" },
  active: { t: "text-green-400", b: "border-green-500/50" },
  completed: { t: "text-zinc-500", b: "border-white/10" },
}[s] || { t: "text-zinc-300", b: "border-white/10" });

const StatCard = ({ label, value, accent = "text-white", testid }) => (
  <div data-testid={testid} className="border border-white/10 bg-[#0a0a0a] p-6">
    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{label}</div>
    <div className={`mt-3 font-mono text-4xl font-medium tracking-tight ${accent}`}>{value}</div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [listRes, statsRes] = await Promise.all([
          api.get("/itineraries"),
          api.get("/dashboard/stats"),
        ]);
        if (mounted) {
          setItineraries(listRes.data);
          setStats(statsRes.data);
        }
      } catch (e) { /* noop */ }
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div data-testid="dashboard-page" className="bg-black min-h-[calc(100vh-4rem)]">
      {/* Header strip */}
      <div className="border-b border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="pulse-dot h-2 w-2 bg-green-400 rounded-full" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">OPS CENTER · ONLINE</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">// OPERATOR CONSOLE</div>
            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-white">
              Welcome back, {user?.full_name?.split(" ")[0] || "Operator"}.
            </h1>
            <p className="text-sm text-zinc-400 mt-2">Active itinerary surveillance and intelligence feed.</p>
          </div>
          <Link
            to="/dashboard/new"
            data-testid="dashboard-new-itinerary-btn"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Itinerary
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard testid="stat-total" label="Total itineraries" value={stats?.total_itineraries ?? "—"} />
          <StatCard testid="stat-active" label="Active" value={stats?.active ?? "—"} accent="text-green-400" />
          <StatCard testid="stat-alerts" label="Alerts tracked" value={stats?.total_alerts ?? "—"} accent="text-orange-400" />
          <StatCard testid="stat-critical" label="Critical flags" value={stats?.critical_alerts ?? "—"} accent="text-red-400" />
        </div>
      </div>

      {/* Itinerary list */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">// MONITORED ITINERARIES</div>
            <h2 className="font-display text-2xl font-bold text-white mt-1">All missions</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            <Radio className="h-3 w-3" /> Live view
          </div>
        </div>

        {loading ? (
          <div className="border border-white/10 p-16 flex items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> <span className="font-mono text-xs uppercase tracking-[0.25em]">LOADING FEED</span>
          </div>
        ) : itineraries.length === 0 ? (
          <div data-testid="dashboard-empty" className="border border-white/10 p-16 text-center">
            <Plane className="h-8 w-8 text-white/70 mx-auto mb-4" strokeWidth={1.5} />
            <div className="font-display text-xl font-bold text-white mb-2">No itineraries monitored yet.</div>
            <p className="text-sm text-zinc-400 mb-6">Create your first itinerary to activate real-time risk assessment.</p>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
            >
              <Plus className="h-4 w-4" /> Create itinerary
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.map((it) => {
              const st = statusStyle(it.status);
              return (
                <Link
                  key={it.id}
                  to={`/dashboard/itinerary/${it.id}`}
                  data-testid={`itinerary-card-${it.id}`}
                  className="border border-white/10 bg-[#0a0a0a] p-6 hover:bg-[#121212] transition-colors flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      MISSION · {it.id.slice(0, 8).toUpperCase()}
                    </div>
                    <span className={`font-mono text-[10px] uppercase tracking-[0.25em] border px-2 py-0.5 ${st.b} ${st.t}`}>
                      {it.status}
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold text-white tracking-tight leading-tight">
                      {it.destination_city}, {it.destination_country}
                    </div>
                    <div className="mt-1 text-xs text-zinc-400 font-mono uppercase tracking-wider">{it.purpose}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">TRAVELER</div>
                      <div className="text-xs text-zinc-300 truncate">{it.traveler_name}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">DATES</div>
                      <div className="text-xs text-zinc-300 font-mono">{it.start_date} → {it.end_date}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    {it.assessment ? (
                      <RiskBadge level={it.assessment.overall_level} />
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
                        <Activity className="h-3 w-3" /> UNASSESSED
                      </span>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3" /> {it.alerts?.length || 0} ALERTS
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
