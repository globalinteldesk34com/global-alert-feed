import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Shield, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const NavItem = ({ to, label, testid }) => (
  <NavLink
    to={to}
    data-testid={testid}
    className={({ isActive }) =>
      `px-3 py-2 text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-150 ${
        isActive ? "text-white" : "text-zinc-500 hover:text-white"
      }`
    }
  >
    {label}
  </NavLink>
);

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo-link" className="flex items-center gap-3 group">
          <div className="h-9 w-9 border border-white/30 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
            <Shield className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-sm tracking-tight text-white">GLOBAL INTEL DESK</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">Itinerary Monitoring</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/" label="Home" testid="nav-home" />
          <NavItem to="/services" label="Services" testid="nav-services" />
          <NavItem to="/about" label="About" testid="nav-about" />
          <NavItem to="/contact" label="Contact" testid="nav-contact" />
          {user && <NavItem to="/dashboard" label="Dashboard" testid="nav-dashboard" />}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span data-testid="nav-user-email" className="font-mono text-xs text-zinc-400 px-3">{user.email}</span>
              <button
                data-testid="nav-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] border border-white/15 text-white hover:bg-white hover:text-black transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                data-testid="nav-login-btn"
                className="px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] text-white hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                data-testid="nav-register-btn"
                className="px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                Get Access
              </Link>
            </>
          )}
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1" onClick={() => setOpen(false)}>
            <NavItem to="/" label="Home" testid="mnav-home" />
            <NavItem to="/services" label="Services" testid="mnav-services" />
            <NavItem to="/about" label="About" testid="mnav-about" />
            <NavItem to="/contact" label="Contact" testid="mnav-contact" />
            {user && <NavItem to="/dashboard" label="Dashboard" testid="mnav-dashboard" />}
            {user ? (
              <button data-testid="mnav-logout" onClick={handleLogout} className="text-left px-3 py-2 text-xs font-mono uppercase tracking-[0.18em] text-white">Logout</button>
            ) : (
              <>
                <Link to="/login" data-testid="mnav-login" className="px-3 py-2 text-xs font-mono uppercase tracking-[0.18em] text-white">Login</Link>
                <Link to="/register" data-testid="mnav-register" className="px-3 py-2 text-xs font-mono uppercase tracking-[0.18em] text-white">Get Access</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
