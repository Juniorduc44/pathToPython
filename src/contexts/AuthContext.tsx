import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

// Types
export type Profile = {
  id: string;
  username: string | null;
  updated_at: string;
  created_at: string;
};

export type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | Error | null;
};

export type AuthContextType = AuthState & {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithMetaMask: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signInWithMagicLink: async () => {},
  signInWithMetaMask: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUsername: async () => {},
  refreshProfile: async () => {},
  clearError: () => {},
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const { toast } = useToast();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, updated_at, created_at")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          const user = session.user;
          const profile = await fetchProfile(user.id);

          setState({
            user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });

          // If authenticated but no username, prompt to set one
          if (profile && !profile.username) {
            toast({
              title: "Set Your Username",
              description: "Please set a username to complete your profile.",
              variant: "warning",
              duration: 5000,
            });
          }
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setState({
          ...state,
          isLoading: false,
          error: error as AuthError,
        });
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session) {
        const user = session.user;
        const profile = await fetchProfile(user.id);

        setState({
          user,
          session,
          profile,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        // If signed in but no username, prompt to set one
        if (profile && !profile.username) {
          toast({
            title: "Set Your Username",
            description: "Please set a username to complete your profile.",
            variant: "warning",
            duration: 5000,
          });
        }
      } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        setState({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }
      // Auth state will be updated by the listener
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as AuthError,
      });
      toast({
        title: "Sign In Failed",
        description: (error as Error).message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      // Auth state will be updated by the listener
    } catch (error) {
      console.error("Error signing in with email:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as AuthError,
      });
      toast({
        title: "Sign In Failed",
        description: (error as Error).message || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  // Sign in with magic link (passwordless)
  const signInWithMagicLink = async (email: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      setState({
        ...state,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Magic Link Sent",
        description: "Check your email for a login link",
        variant: "success",
      });
    } catch (error) {
      console.error("Error sending magic link:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as AuthError,
      });
      toast({
        title: "Magic Link Failed",
        description: (error as Error).message || "Failed to send magic link",
        variant: "destructive",
      });
    }
  };

  // Sign in with MetaMask
  const signInWithMetaMask = async () => {
    setState({ ...state, isLoading: true, error: null });
    try {
      // Check if MetaMask is installed
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];

      if (!address) {
        throw new Error("No Ethereum accounts found. Please unlock your MetaMask account.");
      }

      // Get the nonce to sign
      const nonce = `Sign this message to authenticate with pathToPython: ${Math.floor(Math.random() * 1000000)}`;
      
      // Request signature from user
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonce, address],
      });

      // Verify signature with Supabase
      // Note: This requires a Supabase Edge Function or custom backend endpoint
      // For now, we'll simulate this with a direct signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}@metamask.auth`,
        password: signature.slice(0, 20), // This is a simplified approach, not secure for production
      });

      if (error) {
        // If user doesn't exist, sign them up
        if (error.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${address.toLowerCase()}@metamask.auth`,
            password: signature.slice(0, 20),
            options: {
              data: {
                wallet_address: address,
                auth_method: "metamask",
              },
            },
          });

          if (signUpError) {
            throw signUpError;
          }
          
          toast({
            title: "Account Created",
            description: "Your MetaMask wallet has been connected",
            variant: "success",
          });
        } else {
          throw error;
        }
      }

      // Auth state will be updated by the listener
    } catch (error) {
      console.error("Error signing in with MetaMask:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as Error,
      });
      toast({
        title: "Wallet Connection Failed",
        description: (error as Error).message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      setState({
        ...state,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account",
        variant: "success",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as AuthError,
      });
      toast({
        title: "Sign Up Failed",
        description: (error as Error).message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  // Sign out
  const signOut = async () => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Auth state will be updated by the listener
    } catch (error) {
      console.error("Error signing out:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as AuthError,
      });
      toast({
        title: "Sign Out Failed",
        description: (error as Error).message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  // Update username
  const updateUsername = async (username: string) => {
    if (!state.user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your username",
        variant: "destructive",
      });
      return;
    }

    setState({ ...state, isLoading: true, error: null });
    try {
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingUser) {
        throw new Error("Username is already taken");
      }

      // Update the username
      const { error } = await supabase
        .from("profiles")
        .update({ username, updated_at: new Date().toISOString() })
        .eq("id", state.user.id);

      if (error) {
        throw error;
      }

      // Refresh profile data
      const profile = await fetchProfile(state.user.id);
      setState({
        ...state,
        profile,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Username Updated",
        description: "Your username has been successfully updated",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating username:", error);
      setState({
        ...state,
        isLoading: false,
        error: error as Error,
      });
      toast({
        title: "Update Failed",
        description: (error as Error).message || "Failed to update username",
        variant: "destructive",
      });
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!state.user) return;
    
    try {
      const profile = await fetchProfile(state.user.id);
      setState({
        ...state,
        profile,
      });
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  // Clear error state
  const clearError = () => {
    setState({
      ...state,
      error: null,
    });
  };

  // Define the context value
  const contextValue: AuthContextType = {
    ...state,
    signInWithGoogle,
    signInWithEmail,
    signInWithMagicLink,
    signInWithMetaMask,
    signUp,
    signOut,
    updateUsername,
    refreshProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

// Type declaration for MetaMask's window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
    };
  }
}