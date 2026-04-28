import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Authenticating...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
