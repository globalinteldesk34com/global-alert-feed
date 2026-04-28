import React from "react";
import { Footer } from "../components/Footer";

const ABOUT_IMG = "https://images.pexels.com/photos/1002175/pexels-photo-1002175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function About() {
  return (
    <div data-testid="about-page" className="bg-black">
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-b border-white/10 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-5">// ABOUT</div>
          <h1 className="font-display text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
            Analysts. Operators.<br/>
            <span className="text-zinc-400">On the desk, 24/7.</span>
          </h1>
          <p className="mt-8 text-lg text-zinc-400 leading-relaxed max-w-2xl">
            Global Intel Desk was founded by intelligence officers, security practitioners, and crisis managers
            who have spent careers operating in hostile and austere environments. We built the service we
            always wished our own travelers had.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
            <img src={ABOUT_IMG} alt="Airport silhouette" className="w-full h-full object-cover grayscale" />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-300">FIELD OPERATIONS · 2024</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// MANDATE</div>
          <h2 className="font-display text-3xl font-black tracking-tight text-white">What we exist for.</h2>
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-6 text-base text-zinc-300 leading-relaxed">
          <p>
            To bring institutional-grade intelligence and crisis response capability to every traveler who
            needs it — whether they are a fortune-500 executive, a diplomat, a war correspondent, or an NGO
            worker entering a complex environment.
          </p>
          <p>
            We do not sell apps or alerts. We operate a desk. Every active itinerary is assigned to a human
            analyst who knows the traveler, the terrain, and the threat picture.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {[
            { v: "193", l: "Countries Covered" },
            { v: "24/7", l: "Operations Desk" },
            { v: "3 min", l: "Crisis Response SLA" },
            { v: "271", l: "Evacuations · 12mo" },
          ].map((s, i) => (
            <div key={i} className="bg-black p-10 text-center">
              <div className="font-mono text-4xl sm:text-5xl font-medium tracking-tight text-white">{s.v}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4">// PRINCIPLES</div>
        <h2 className="font-display text-4xl font-black tracking-tight text-white mb-12">How the desk operates.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { h: "Precision over volume", p: "We do not flood you with noise. Every alert is graded, sourced, and actionable." },
            { h: "Human in the loop", p: "Automation powers coverage. Decisions belong to trained analysts, always." },
            { h: "Discretion by default", p: "Your itineraries, movements, and incidents never leave the desk. Period." },
          ].map((x, i) => (
            <div key={i} className="border border-white/10 p-8 hover:bg-[#121212] transition-colors">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4">0{i + 1}</div>
              <div className="font-display text-xl font-bold text-white mb-3">{x.h}</div>
              <p className="text-sm text-zinc-400 leading-relaxed">{x.p}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
