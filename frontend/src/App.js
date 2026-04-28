import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewItinerary from "./pages/NewItinerary";
import ItineraryDetail from "./pages/ItineraryDetail";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#0a0a0a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "2px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
            />
            <Route
              path="/dashboard/new"
              element={<ProtectedRoute><Layout><NewItinerary /></Layout></ProtectedRoute>}
            />
            <Route
              path="/dashboard/itinerary/:id"
              element={<ProtectedRoute><Layout><ItineraryDetail /></Layout></ProtectedRoute>}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
