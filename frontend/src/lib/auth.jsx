import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";

const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user || null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user || null
          );
        }
      );

    return () =>
      subscription.unsubscribe();
  }, []);

  const register = async ({
    email,
    password,
  }) => {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) throw error;

    return data.user;
  };

  const login = async (
    email,
    password
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) throw error;

    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
