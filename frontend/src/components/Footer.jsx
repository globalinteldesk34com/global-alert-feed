import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 border border-white/30 flex items-center justify-center bg-white/5">
              <Shield className="h-4 w-4 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <div className="font-display font-black tracking-tight text-white">GLOBAL INTEL DESK</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">Secure every journey</div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            Intelligence-grade itinerary monitoring for travelers operating in high-risk environments.
            Real-time threat alerts, assessed destinations, and 24/7 crisis support.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="pulse-dot h-2 w-2 bg-green-400 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">OPS CENTER ONLINE · 24/7</span>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-zinc-300 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/services" className="text-zinc-300 hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/about" className="text-zinc-300 hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-zinc-300 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4">Crisis Line</div>
          <div className="text-white font-display font-black text-xl">+1 (800) 555-0198</div>
          <div className="text-xs text-zinc-400 mt-1">Monitored 24 · 7 · 365</div>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">HQ</div>
          <div className="text-sm text-zinc-300">Washington, DC · London · Singapore</div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          © {new Date().getFullYear()} Global Intel Desk — All rights reserved
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          ISO 27001 · GDPR · SOC 2 TYPE II
        </div>
      </div>
    </footer>
  );
};
