import React from "react";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import { MapPin, BellRing, ShieldAlert, ClipboardList, Radio, Users, Headset, HeartPulse } from "lucide-react";

const ServiceRow = ({ num, icon: Icon, title, summary, bullets }) => (
  <div data-testid={`service-row-${num}`} className="grid grid-cols-12 gap-6 py-12 border-b border-white/10">
    <div className="col-span-12 md:col-span-2">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">PROTOCOL · 0{num}</div>
      <Icon className="mt-4 h-6 w-6 text-white" strokeWidth={1.5} />
    </div>
    <div className="col-span-12 md:col-span-5">
      <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-4 text-base text-zinc-400 leading-relaxed">{summary}</p>
    </div>
    <div className="col-span-12 md:col-span-5">
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {bullets.map((b, i) => (
          <li key={i} className="py-3 flex items-start gap-3">
            <span className="mt-1 h-1 w-3 bg-white flex-shrink-0" />
            <span className="text-sm text-zinc-300">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default function Services() {
  return (
    <div data-testid="services-page" className="bg-black">
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-b border-white/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-5">// CAPABILITY STACK</div>
        <h1 className="font-display text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
          Services.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          A complete itinerary-based protection stack — every phase of your traveler's journey instrumented,
          monitored, and supported by operations analysts.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <ServiceRow
          num="1"
          icon={MapPin}
          title="Destination & Route Assessments"
          summary="Before departure, we produce a tailored risk briefing covering political stability, crime trends, health system resilience, natural hazard exposure, and traveler-specific threats."
          bullets={[
            "AI-augmented country and city risk scoring (0-100)",
            "Per-leg route analysis including airport, ground, and lodging",
            "Traveler profile matching (diplomatic, NGO, executive, media)",
            "Up-to-the-hour open-source and proprietary intelligence sources",
          ]}
        />
        <ServiceRow
          num="2"
          icon={BellRing}
          title="Real-Time Threat Alerts"
          summary="Continuous monitoring against every active itinerary. When the picture changes, you know within minutes — severity-graded, geolocated, and actionable."
          bullets={[
            "Severity classification: LOW · MODERATE · HIGH · CRITICAL",
            "Category filters: Political · Crime · Health · Weather · Transport · Cyber",
            "Multi-channel delivery: SMS, email, in-app, phone call",
            "Threat-to-itinerary proximity scoring",
          ]}
        />
        <ServiceRow
          num="3"
          icon={ShieldAlert}
          title="Emergency Protocols"
          summary="Every monitored itinerary is paired with predefined response playbooks — medical, security, detention, natural disaster, and evacuation — activated by trained crisis analysts."
          bullets={[
            "Crisis analyst assignment within 3 minutes of activation",
            "Medical evacuation and repatriation coordination",
            "Ground extraction via vetted local partners",
            "Next-of-kin and corporate notification tree",
          ]}
        />
        <ServiceRow
          num="4"
          icon={ClipboardList}
          title="Post-Travel Debriefings"
          summary="Insights from incidents or near-misses feed back into stronger protocols for the next mission. Every journey makes the next one safer."
          bullets={[
            "Structured debrief interview within 72 hours of return",
            "Incident taxonomy and root-cause analysis",
            "Updated destination-specific recommendations",
            "Quarterly posture reports for organizational leadership",
          ]}
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// WRAPAROUND</div>
        <h2 className="font-display text-4xl font-black tracking-tighter text-white mb-10">Always-on support.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {[
            { ic: Headset, t: "24/7 Crisis Line", d: "Speak to a live analyst in under 30 seconds, any time, any zone." },
            { ic: HeartPulse, t: "Medical Partnerships", d: "Global network of trauma centers, clinics, and air-medical operators." },
            { ic: Users, t: "Local Assets", d: "Vetted drivers, fixers, and security personnel in every major hub." },
            { ic: Radio, t: "Private Comms", d: "Encrypted check-in channels for sensitive or high-profile travelers." },
            { ic: ShieldAlert, t: "Executive Protection", d: "On-request close protection deployed to match the threat picture." },
            { ic: ClipboardList, t: "Duty-of-Care Reporting", d: "Board-ready reports aligned to ISO 31030 travel risk management." },
          ].map((x, i) => (
            <div key={i} className="bg-black p-8 hover:bg-[#121212] transition-colors">
              <x.ic className="h-5 w-5 text-white mb-5" strokeWidth={1.5} />
              <div className="font-display font-bold text-white mb-2">{x.t}</div>
              <div className="text-sm text-zinc-400 leading-relaxed">{x.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10 p-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">ENGAGEMENT MODEL</div>
            <div className="font-display text-2xl font-bold text-white">Tailored retainers · per-trip · embedded teams.</div>
          </div>
          <Link to="/contact" data-testid="services-cta-contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors">
            Request a briefing
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
