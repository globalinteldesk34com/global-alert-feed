import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useAuth } from "../lib/auth";
import api from "../lib/api";
import {
  Plus,
  Loader2,
  Radio,
} from "lucide-react";

const StatCard = ({
  label,
  value,
  accent = "text-white",
}) => (
  <div className="border border-white/10 bg-[#0a0a0a] p-6">
    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
      {label}
    </div>

    <div
      className={`mt-3 font-mono text-4xl font-medium tracking-tight ${accent}`}
    >
      {value}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  const [itineraries, setItineraries] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [listRes, statsRes] =
          await Promise.all([
            api.get("/itineraries"),
            api.get("/dashboard/stats"),
          ]);

        if (mounted) {
          setItineraries(
            listRes.data || []
          );

          setStats(
            statsRes.data || {}
          );
        }
      } catch (e) {
        console.log(e);

        if (mounted) {
          setItineraries([]);
          setStats({});
        }
      } finally {
        if (mounted)
          setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 bg-green-400 rounded-full" />

              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                OPS CENTER · ONLINE
              </span>
            </div>

            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
              // OPERATOR CONSOLE
            </div>

            <h1 className="text-4xl font-bold">
              Welcome back,{" "}
              {user?.email?.split(
                "@"
              )[0] || "Operator"}
            </h1>

            <p className="text-sm text-zinc-400 mt-2">
              Active itinerary
              surveillance and
              intelligence feed.
            </p>
          </div>

          <Link
            to="/dashboard/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em]"
          >
            <Plus className="h-4 w-4" />
            New Itinerary
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total itineraries"
            value={
              stats?.total_itineraries ||
              0
            }
          />

          <StatCard
            label="Active"
            value={stats?.active || 0}
            accent="text-green-400"
          />

          <StatCard
            label="Alerts tracked"
            value={
              stats?.total_alerts || 0
            }
            accent="text-orange-400"
          />

          <StatCard
            label="Critical flags"
            value={
              stats?.critical_alerts ||
              0
            }
            accent="text-red-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              // MONITORED
              ITINERARIES
            </div>

            <h2 className="text-2xl font-bold mt-1">
              All missions
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            <Radio className="h-3 w-3" />
            Live view
          </div>
        </div>

        {loading ? (
          <div className="border border-white/10 p-16 flex items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />

            <span className="font-mono text-xs uppercase tracking-[0.25em]">
              Loading Feed
            </span>
          </div>
        ) : itineraries.length === 0 ? (
          <div className="border border-white/10 p-16 text-center">
            <h2 className="text-2xl font-bold">
              Dashboard Working
            </h2>

            <p className="mt-4 text-zinc-400">
              Login successful.
              Supabase connected.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {itineraries.map((it) => (
              <div
                key={it.id}
                className="border border-white/10 p-6 bg-[#0a0a0a]"
              >
                <h2 className="text-xl font-bold">
                  {
                    it.destination_city
                  }
                  ,{" "}
                  {
                    it.destination_country
                  }
                </h2>

                <p className="text-zinc-400 mt-2">
                  {it.traveler_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
