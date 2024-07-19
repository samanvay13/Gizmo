import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component to provide authentication context
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Fetch session on initial load and set up auth state change listener
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

  // Function to sign in a user
  const signIn = async (email, password) => {
    setLoadingAuth(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsUserLoggedIn(true);
    setLoadingAuth(false);
  };

  // Function to sign up a new user
  const signUp = async (email, password) => {
    setLoadingAuth(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setIsUserLoggedIn(!!session);
    setLoadingAuth(false);
    if (!session) alert('Please check your inbox for email verification!');
  };

  // Function to sign out the user
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setIsUserLoggedIn(false);
  };

  // Fetch user profile if session exists
  useEffect(() => {
    if (session?.user) getProfile();
  }, [session]);

  // Function to fetch user profile from Supabase
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

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={{ session, user, profile, signIn, signUp, signOut, isUserLoggedIn, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
