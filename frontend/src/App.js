import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import { AuthProvider } from "./lib/auth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
