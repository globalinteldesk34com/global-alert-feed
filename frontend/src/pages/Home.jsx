import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import {
  ArrowRight, Activity, MapPin, BellRing, ShieldAlert,
  ClipboardList, Radio, Globe2, Plane, CheckCircle2
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1774646598677-cc38cb3cac00?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3QlMjB0b3BvZ3JhcGh5JTIwbWFwfGVufDB8fHx8MTc3NzM1MDE2Mnww&ixlib=rb-4.1.0&q=85";

const TICKER_ITEMS = [
  { c: "KINSHASA, CD", s: "ELEVATED", t: "Civil unrest reported near government district" },
  { c: "LAGOS, NG", s: "MODERATE", t: "Port strike disrupting transport logistics" },
  { c: "BEIRUT, LB", s: "HIGH", t: "Border tensions — restricted corridor advisory" },
  { c: "CARACAS, VE", s: "HIGH", t: "Fuel shortage impacting ground transport" },
  { c: "PORT-AU-PRINCE, HT", s: "CRITICAL", t: "Armed group activity near airport" },
  { c: "KABUL, AF", s: "CRITICAL", t: "Checkpoint operations — delays expected" },
  { c: "NAIROBI, KE", s: "LOW", t: "Security posture nominal, monitor weather" },
  { c: "MEXICO CITY, MX", s: "MODERATE", t: "Protests in Zocalo district — avoid area" },
];

const sevColor = (s) => ({
  LOW: "text-green-400",
  MODERATE: "text-yellow-400",
  ELEVATED: "text-orange-400",
  HIGH: "text-orange-400",
  CRITICAL: "text-red-400",
}[s] || "text-white");

const Step = ({ num, icon: Icon, title, body }) => (
  <div data-testid={`step-card-${num}`} className="group border border-white/10 bg-[#0a0a0a] hover:bg-[#121212] transition-colors p-8 flex flex-col gap-5 h-full">
    <div className="flex items-start justify-between">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">STEP · {num}</div>
      <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
    </div>
    <h3 className="font-display text-xl font-bold text-white tracking-tight">{title}</h3>
    <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
    <div className="mt-auto pt-4 border-t border-white/10 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
      PROTOCOL · 0{num}
    </div>
  </div>
);

export default function Home() {
  return (
    <div data-testid="home-page" className="bg-black">
      {/* ============ HERO ============ */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
          <div className="flex items-center gap-3 mb-10">
            <span className="pulse-dot h-2 w-2 bg-red-500 rounded-full" />
            <span data-testid="hero-live-tag" className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-300">
              LIVE · OPS CENTER · GMT {new Date().toUTCString().slice(17, 22)}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-9">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-6">
                ITINERARY-BASED MONITORING / GLOBAL INTEL DESK
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white">
                Secure your travelers<br />
                <span className="text-zinc-400">with foresight</span> & precision.
              </h1>
              <p className="mt-8 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
                For business trips, diplomatic missions, and journeys through high-risk environments — we fuse
                real-time intelligence, destination risk analytics, and robust emergency protocols into one
                continuously-monitored operation.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  data-testid="hero-cta-register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
                >
                  Activate Monitoring <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  to="/contact"
                  data-testid="hero-cta-contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                >
                  Talk to Operations
                </Link>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 border-l border-white/10 pl-6 lg:mt-0 mt-10">
              <div className="space-y-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">TRAVELERS TRACKED</div>
                  <div className="font-mono text-4xl text-white font-medium tracking-tight">14,820</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">COUNTRIES COVERED</div>
                  <div className="font-mono text-4xl text-white font-medium tracking-tight">193</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">EVACUATIONS · 12MO</div>
                  <div className="font-mono text-4xl text-white font-medium tracking-tight">271</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center">
            <div className="flex-shrink-0 px-5 py-3 border-r border-white/10 font-mono text-[10px] uppercase tracking-[0.25em] text-red-400 flex items-center gap-2">
              <Radio className="h-3 w-3" strokeWidth={2} /> INTEL FEED
            </div>
            <div className="overflow-hidden flex-1">
              <div className="ticker-track flex whitespace-nowrap">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((i, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-6 py-3 border-r border-white/5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{i.c}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sevColor(i.s)}`}>[{i.s}]</span>
                    <span className="text-xs text-zinc-300">{i.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOUR STEP PROTOCOL ============ */}
      <section data-testid="four-step-section" className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-12 gap-10 mb-14">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// THE PROTOCOL</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.05]">
              Four phases. One continuous operation.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-base text-zinc-400 leading-relaxed">
              Our itinerary-based monitoring is not a dashboard — it is a full intelligence cycle built
              around the traveler's journey. Before departure, in-country, and after return.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Step num="1" icon={MapPin} title="Destination & Route Assessment"
            body="Thorough pre-trip evaluation of political stability, crime, health, natural hazards and route-specific threats — tailored to traveler profile." />
          <Step num="2" icon={BellRing} title="Real-Time Threat Alerts"
            body="24/7 monitoring pushes immediate alerts to you and our operations team — severe weather, political unrest, or unexpected disruptions." />
          <Step num="3" icon={ShieldAlert} title="Emergency Protocols"
            body="Predefined response playbooks for security breaches or logistical failures — activated within minutes by our crisis team." />
          <Step num="4" icon={ClipboardList} title="Post-Travel Debriefings"
            body="Structured debrief sessions analyze incidents or near-misses to refine and strengthen your future travel security posture." />
        </div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section className="border-y border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// WHY GLOBAL INTEL DESK</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.05]">
              Not a monitoring service.<br />An operational partner.
            </h2>
            <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-md">
              Unlike basic monitoring, we provide continuous support through advanced intelligence gathering,
              robust emergency protocols, and partnerships with vetted local resources on every continent.
            </p>
            <Link
              to="/services"
              data-testid="why-view-services-btn"
              className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
            >
              View full service matrix <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-px bg-white/10">
            {[
              { ic: Globe2, t: "Global Intelligence Network", d: "193 countries. Local assets in every capital and major commercial hub." },
              { ic: Activity, t: "Continuous Monitoring", d: "24/7/365 operations center tracks threats against every active itinerary." },
              { ic: Plane, t: "Evacuation & Extraction", d: "Ground, air, and medical evacuation coordinated end-to-end." },
              { ic: CheckCircle2, t: "Compliance & Duty of Care", d: "ISO 27001, SOC 2 Type II, and GDPR-aligned by design." },
            ].map((f, i) => (
              <div key={i} className="bg-black p-8 hover:bg-[#121212] transition-colors">
                <f.ic className="h-5 w-5 text-white mb-5" strokeWidth={1.5} />
                <div className="font-display text-lg font-bold text-white mb-2">{f.t}</div>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-sm opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// READY WHEN YOU ARE</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.05] max-w-2xl">
              Your next trip departs soon.<br />
              <span className="text-zinc-400">Let's get it secured.</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <Link
              to="/register"
              data-testid="cta-band-register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
            >
              Create operator account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              data-testid="cta-band-contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
            >
              Request briefing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
