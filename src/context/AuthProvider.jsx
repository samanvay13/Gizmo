import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setIsUserLoggedIn(!!session?.user);
      setLoadingAuth(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsUserLoggedIn(!!session?.user);
      setLoadingAuth(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoadingAuth(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsUserLoggedIn(true);
    setLoadingAuth(false);
  };

  const signUp = async (email, password) => {
    setLoadingAuth(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setIsUserLoggedIn(!!session);
    setLoadingAuth(false);
    if (!session) alert('Please check your inbox for email verification!');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    if (session?.user) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoadingAuth(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, signIn, signUp, signOut, isUserLoggedIn, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
