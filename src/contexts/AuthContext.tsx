/**
 * @file AuthContext.tsx
 * @version 2.0.0
 * @description Manages user authentication state with dual authentication support:
 * 1. Keystore-based self-custody authentication (original)
 * 2. Supabase-based authentication (new)
 * 
 * This context handles guest mode, keystore operations, Supabase auth methods,
 * and ensures client-side cryptographic operations for user security.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date June 10, 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import supabase from '@/lib/supabase'; // Import Supabase client
import { Session, User, AuthError } from '@supabase/supabase-js'; // Import Supabase types

// =====================================================================================
// CONSTANTS & CONFIGURATION
// =====================================================================================

const KEYSTORE_ENCRYPTION_ALGORITHM_NAME = 'AES-GCM';
const KEYSTORE_KEY_LENGTH = 256; // AES-256
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH_ALGORITHM = 'SHA-256';

// Switched to ECDSA P-256 for better browser compatibility
const ASYMMETRIC_KEY_ALGORITHM = { name: "ECDSA", namedCurve: "P-256" };
const SIGNATURE_ALGORITHM = { name: "ECDSA", hash: { name: "SHA-256" } };
const KEYSTORE_VERSION = "2.0-ecdsa"; // Version to indicate ECDSA usage

const SESSION_STORAGE_KEY = 'pythonQuestAuth';

// =====================================================================================
// TYPE DEFINITIONS & INTERFACES
// =====================================================================================

// Extended AuthMode to include Supabase authentication
export type AuthMode = 'unauthenticated' | 'guest' | 'keystore' | 'supabase';

// Profile type for Supabase users
export type Profile = {
  id: string;
  username: string | null;
  updated_at: string;
  created_at: string;
};

export interface Keystore {
  publicKeyHex: string;         // User's public key (ECDSA P-256, SPKI format), hex encoded
  encryptedPrivateKey: string;  // User's private key (ECDSA P-256, PKCS8 format), AES-GCM encrypted, base64 encoded
  salt: string;                 // Salt used for PBKDF2 key derivation, base64 encoded
  iv: string;                   // Initialization Vector used for AES-GCM, base64 encoded
  version: string;              // Keystore version (e.g., "2.0-ecdsa")
  keyAlgorithm: string;         // e.g., "ECDSA-P256"
  encryptionAlgorithm: string;  // e.g., "AES-GCM-256"
  pbkdf2Iterations: number;     // Iterations for PBKDF2
}

export interface AuthUser {
  publicKeyHex: string;
}

// Extended AuthContextType to include Supabase functionality
interface AuthContextType {
  // General auth state
  authMode: AuthMode;
  isLoading: boolean;
  error: string | null;
  setError: (message: string | null) => void;
  
  // Auth state flags
  isAuthenticated: boolean; // True for both keystore and supabase auth
  isGuest: boolean; // True for guest mode
  isKeystoreAuthenticated: boolean; // True only for keystore auth
  isSupabaseAuthenticated: boolean; // True only for supabase auth
  
  // Keystore-specific properties and methods
  currentUser: AuthUser | null;
  createAccount: (password: string) => Promise<void>;
  loginWithKeystore: (keystoreFile: File, password: string) => Promise<void>;
  signData: (data: string) => Promise<string | null>;
  
  // Supabase-specific properties and methods
  supabaseUser: User | null;
  supabaseSession: Session | null;
  profile: Profile | null;
  signInWithGitHub: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // Combined methods that work for both auth types
  logout: () => Promise<void>;
  switchToGuestMode: () => void;
}

// Helper to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper to convert Base64 string to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper to convert ArrayBuffer to Hex string
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Keystore-specific state
  const [keystoreAuthMode, setKeystoreAuthMode] = useState<'unauthenticated' | 'guest' | 'keystore'>('unauthenticated');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sessionPrivateKey, setSessionPrivateKey] = useState<CryptoKey | null>(null);

  // Supabase-specific state
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // General auth state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Computed auth mode based on both auth systems
  const authMode: AuthMode = useCallback(() => {
    if (keystoreAuthMode === 'keystore') return 'keystore';
    if (supabaseUser) {
      if (supabaseUser.app_metadata?.provider === 'anonymous') return 'guest';
      return 'supabase';
    }
    if (keystoreAuthMode === 'guest') return 'guest';
    return 'unauthenticated';
  }, [keystoreAuthMode, supabaseUser])();

  // Computed auth flags
  const isAuthenticated = authMode === 'keystore' || authMode === 'supabase';
  const isGuest = authMode === 'guest';
  const isKeystoreAuthenticated = authMode === 'keystore';
  const isSupabaseAuthenticated = authMode === 'supabase';

  // =====================================================================================
  // KEYSTORE AUTHENTICATION LOGIC (EXISTING)
  // =====================================================================================

  // Initialize keystore auth state from session storage
  useEffect(() => {
    console.debug("[AuthContext] Initializing keystore auth state from session storage...");
    try {
      const storedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedAuth) {
        const { mode, user } = JSON.parse(storedAuth);
        if (mode === 'keystore' && user && user.publicKeyHex) {
          setKeystoreAuthMode('keystore');
          setCurrentUser(user);
          console.debug("[AuthContext] Keystore session restored (publicKey only).");
        } else if (mode === 'guest') {
          setKeystoreAuthMode('guest');
          console.debug("[AuthContext] Guest session restored.");
        } else {
          setKeystoreAuthMode('unauthenticated');
        }
      } else {
        setKeystoreAuthMode('unauthenticated');
        console.debug("[AuthContext] No session state found, defaulting to unauthenticated.");
      }
    } catch (e) {
      console.error("[AuthContext] Error initializing keystore auth state:", e);
      setKeystoreAuthMode('unauthenticated');
    }
  }, []);

  // Persist keystore auth state to session storage
  useEffect(() => {
    if (!isLoading) {
      console.debug("[AuthContext] Persisting keystore auth state to session storage:", { keystoreAuthMode, currentUser });
      try {
        if (keystoreAuthMode === 'keystore' && currentUser) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ mode: keystoreAuthMode, user: currentUser }));
        } else if (keystoreAuthMode === 'guest') {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ mode: keystoreAuthMode, user: null }));
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch(e) {
        console.error("[AuthContext] Error persisting keystore auth state:", e);
      }
    }
  }, [keystoreAuthMode, currentUser, isLoading]);

  const generateEcdsaKeyPair = async (): Promise<CryptoKeyPair> => {
    console.debug("[AuthContext] Generating ECDSA P-256 key pair...");
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        ASYMMETRIC_KEY_ALGORITHM,
        true, // extractable
        ['sign', 'verify']
      );
      console.debug("[AuthContext] ECDSA key pair generated successfully.");
      return keyPair;
    } catch (e) {
      console.error("[AuthContext] Error generating ECDSA key pair:", e);
      throw e;
    }
  };

  const deriveKeyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    console.debug("[AuthContext] Deriving encryption key from password using PBKDF2...");
    try {
      const masterKey = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: PBKDF2_ITERATIONS,
          hash: PBKDF2_HASH_ALGORITHM,
        },
        masterKey,
        { name: KEYSTORE_ENCRYPTION_ALGORITHM_NAME, length: KEYSTORE_KEY_LENGTH },
        true, // extractable for debugging, should be false for derived keys if not re-exported
        ['encrypt', 'decrypt']
      );
      console.debug("[AuthContext] Encryption key derived successfully.");
      return derivedKey;
    } catch (e) {
      console.error("[AuthContext] Error deriving key from password:", e);
      throw e;
    }
  };

  const encryptPrivateKey = async (derivedKey: CryptoKey, privateKeyDataPkcs8: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> => {
    console.debug("[AuthContext] Encrypting private key (PKCS8)...");
    try {
      const encrypted = await window.crypto.subtle.encrypt(
        { name: KEYSTORE_ENCRYPTION_ALGORITHM_NAME, iv: iv },
        derivedKey,
        privateKeyDataPkcs8
      );
      console.debug("[AuthContext] Private key encrypted successfully.");
      return encrypted;
    } catch (e) {
      console.error("[AuthContext] Error encrypting private key:", e);
      throw e;
    }
  };

  const decryptPrivateKey = async (derivedKey: CryptoKey, encryptedPrivateKeyData: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> => {
    console.debug("[AuthContext] Decrypting private key...");
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: KEYSTORE_ENCRYPTION_ALGORITHM_NAME, iv: iv },
        derivedKey,
        encryptedPrivateKeyData
      );
      console.debug("[AuthContext] Private key decrypted successfully.");
      return decrypted;
    } catch (e) {
      console.error("[AuthContext] Error decrypting private key (likely wrong password or corrupted data):", e);
      throw e; // Rethrow to be caught by login/create logic
    }
  };

  const exportPublicKeySpki = async (key: CryptoKey): Promise<ArrayBuffer> => {
    console.debug("[AuthContext] Exporting public key (SPKI)...");
    try {
      const exported = await window.crypto.subtle.exportKey('spki', key);
      console.debug("[AuthContext] Public key exported successfully.");
      return exported;
    } catch (e) {
      console.error("[AuthContext] Error exporting public key:", e);
      throw e;
    }
  };
  
  const exportPrivateKeyPkcs8 = async (key: CryptoKey): Promise<ArrayBuffer> => {
    console.debug("[AuthContext] Exporting private key (PKCS8)...");
    try {
      const exported = await window.crypto.subtle.exportKey('pkcs8', key);
      console.debug("[AuthContext] Private key exported successfully.");
      return exported;
    } catch (e) {
      console.error("[AuthContext] Error exporting private key:", e);
      throw e;
    }
  };
  
  const importEcdsaPrivateKeyPkcs8 = async (keyDataPkcs8: ArrayBuffer): Promise<CryptoKey> => {
    console.debug("[AuthContext] Importing ECDSA private key (PKCS8)...");
    try {
      const privateKey = await window.crypto.subtle.importKey(
          'pkcs8',
          keyDataPkcs8,
          ASYMMETRIC_KEY_ALGORITHM,
          true, // extractable (can be false if not re-exported)
          ['sign']
      );
      console.debug("[AuthContext] ECDSA private key imported successfully.");
      return privateKey;
    } catch (e) {
      console.error("[AuthContext] Error importing ECDSA private key:", e);
      throw e;
    }
  };

  const createAccount = useCallback(async (password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    console.debug("[AuthContext] Starting account creation...");
    try {
      const keyPair = await generateEcdsaKeyPair();
      if (!keyPair.publicKey || !keyPair.privateKey) {
        throw new Error("Key pair generation failed.");
      }
      const publicKeySpki = await exportPublicKeySpki(keyPair.publicKey);
      const privateKeyPkcs8 = await exportPrivateKeyPkcs8(keyPair.privateKey);

      const publicKeyHex = arrayBufferToHex(publicKeySpki);

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const derivedKey = await deriveKeyFromPassword(password, salt);
      const encryptedPrivateKeyArrBuffer = await encryptPrivateKey(derivedKey, privateKeyPkcs8, iv);
      
      const keystoreData: Keystore = {
        publicKeyHex,
        encryptedPrivateKey: arrayBufferToBase64(encryptedPrivateKeyArrBuffer),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
        version: KEYSTORE_VERSION,
        keyAlgorithm: "ECDSA-P256",
        encryptionAlgorithm: `${KEYSTORE_ENCRYPTION_ALGORITHM_NAME}-${KEYSTORE_KEY_LENGTH}`,
        pbkdf2Iterations: PBKDF2_ITERATIONS,
      };

      const keystoreString = JSON.stringify(keystoreData, null, 2);
      const blob = new Blob([keystoreString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PythonQuest_Keystore_ECDSA_${publicKeyHex.substring(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.info("[AuthContext] Keystore file downloaded.");

      const user: AuthUser = { publicKeyHex };
      setCurrentUser(user);
      setKeystoreAuthMode('keystore');
      setSessionPrivateKey(keyPair.privateKey);
      console.info("[AuthContext] Account created successfully. User is now keystore authenticated.");

    } catch (e: any) {
      console.error("[AuthContext] Error creating account:", e, e.stack);
      setError(`Account creation failed: ${e.message || 'Unknown cryptographic error'}`);
      setKeystoreAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithKeystore = useCallback(async (keystoreFile: File, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    console.debug("[AuthContext] Starting login with keystore...");
    try {
      const keystoreString = await keystoreFile.text();
      const keystoreData: Keystore = JSON.parse(keystoreString);

      if (keystoreData.version !== KEYSTORE_VERSION || keystoreData.keyAlgorithm !== "ECDSA-P256") {
        console.warn("[AuthContext] Keystore version or algorithm mismatch.", keystoreData);
        throw new Error("Invalid or outdated keystore file. Please use a keystore generated with ECDSA P-256.");
      }
      if (!keystoreData.publicKeyHex || !keystoreData.encryptedPrivateKey || !keystoreData.salt || !keystoreData.iv) {
        throw new Error("Invalid or corrupted keystore file format.");
      }

      const salt = base64ToArrayBuffer(keystoreData.salt);
      const iv = base64ToArrayBuffer(keystoreData.iv);
      const encryptedPrivateKeyData = base64ToArrayBuffer(keystoreData.encryptedPrivateKey);

      const derivedKey = await deriveKeyFromPassword(password, salt);
      const privateKeyPkcs8 = await decryptPrivateKey(derivedKey, encryptedPrivateKeyData, iv);
      
      const privateKey = await importEcdsaPrivateKeyPkcs8(privateKeyPkcs8);
      if (!privateKey) {
          throw new Error("Failed to import decrypted private key.");
      }

      const user: AuthUser = { publicKeyHex: keystoreData.publicKeyHex };
      setCurrentUser(user);
      setKeystoreAuthMode('keystore');
      setSessionPrivateKey(privateKey);
      console.info("[AuthContext] Login successful. User is now keystore authenticated.");

    } catch (e: any) {
      console.error("[AuthContext] Error logging in with keystore:", e, e.stack);
      if (e.name === 'OperationError' || (e.message && (e.message.toLowerCase().includes('decryption failed') || e.message.toLowerCase().includes('tag doesn\'t match')))) {
        setError("Login failed: Invalid password or corrupted keystore.");
      } else {
        setError(`Login failed: ${e.message || 'Unknown error during login'}`);
      }
      setKeystoreAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signData = useCallback(async (dataString: string): Promise<string | null> => {
    if (!sessionPrivateKey || keystoreAuthMode !== 'keystore') {
      const msg = "Not authenticated with a keystore to sign data.";
      console.warn(`[AuthContext] ${msg}`);
      setError(msg);
      return null;
    }
    console.debug("[AuthContext] Signing data...");
    try {
      const dataBuffer = new TextEncoder().encode(dataString);
      const signatureBuffer = await window.crypto.subtle.sign(
        SIGNATURE_ALGORITHM,
        sessionPrivateKey,
        dataBuffer
      );
      const signatureHex = arrayBufferToHex(signatureBuffer);
      console.debug("[AuthContext] Data signed successfully. Signature (hex):", signatureHex);
      return signatureHex;
    } catch (e: any) {
      console.error("[AuthContext] Error signing data:", e, e.stack);
      setError(`Signing failed: ${e.message || 'Unknown cryptographic error during signing'}`);
      return null;
    }
  }, [sessionPrivateKey, keystoreAuthMode]);

  // =====================================================================================
  // SUPABASE AUTHENTICATION LOGIC (NEW)
  // =====================================================================================

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, updated_at, created_at")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("[AuthContext] Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error("[AuthContext] Error in fetchProfile:", error);
      return null;
    }
  }, []);

  // Initialize Supabase auth state and set up listener
  useEffect(() => {
    const initializeSupabaseAuth = async () => {
      setIsLoading(true);
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          const user = session.user;
          const userProfile = await fetchProfile(user.id);

          setSupabaseUser(user);
          setSupabaseSession(session);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing Supabase auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSupabaseAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Supabase auth state changed:", event);

      if (event === "SIGNED_IN" && session) {
        const user = session.user;
        const userProfile = await fetchProfile(user.id);

        setSupabaseUser(user);
        setSupabaseSession(session);
        setProfile(userProfile);
      } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        setSupabaseUser(null);
        setSupabaseSession(null);
        setProfile(null);
      }
    });

    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Refresh profile data
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!supabaseUser) return;
    
    try {
      const userProfile = await fetchProfile(supabaseUser.id);
      setProfile(userProfile);
    } catch (error) {
      console.error("[AuthContext] Error refreshing profile:", error);
    }
  }, [supabaseUser, fetchProfile]);

  // Sign in with GitHub
  const signInWithGitHub = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }
      // Auth state will be updated by the listener
    } catch (error: any) {
      console.error("[AuthContext] Error signing in with GitHub:", error);
      setError(error.message || "Failed to sign in with GitHub");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in with magic link
  const signInWithMagicLink = useCallback(async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
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
      
      console.info("[AuthContext] Magic link sent successfully.");
    } catch (error: any) {
      console.error("[AuthContext] Error sending magic link:", error);
      setError(error.message || "Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in anonymously
  const signInAnonymously = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }
      
      console.info("[AuthContext] Anonymous sign-in successful.");
    } catch (error: any) {
      console.error("[AuthContext] Error signing in anonymously:", error);
      setError(error.message || "Failed to sign in as guest");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update username
  const updateUsername = useCallback(async (username: string): Promise<void> => {
    if (!supabaseUser) {
      setError("You must be logged in to update your username");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .neq("id", supabaseUser.id) // Exclude current user
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
        .eq("id", supabaseUser.id);

      if (error) {
        throw error;
      }

      // Refresh profile data
      await refreshProfile();
      console.info("[AuthContext] Username updated successfully.");
    } catch (error: any) {
      console.error("[AuthContext] Error updating username:", error);
      setError(error.message || "Failed to update username");
    } finally {
      setIsLoading(false);
    }
  }, [supabaseUser, refreshProfile]);

  // =====================================================================================
  // COMBINED AUTHENTICATION METHODS
  // =====================================================================================

  // Combined logout function that handles both auth types
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    console.debug("[AuthContext] Logging out...");
    
    try {
      // Handle Supabase logout if needed
      if (supabaseUser) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      }
      
      // Handle Keystore logout
      setKeystoreAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      
      console.info("[AuthContext] User logged out successfully.");
    } catch (error: any) {
      console.error("[AuthContext] Error logging out:", error);
      setError(error.message || "Failed to log out");
    } finally {
      setIsLoading(false);
    }
  }, [supabaseUser]);

  // Modified switchToGuestMode to use Supabase anonymous sign-in
  const switchToGuestMode = useCallback((): void => {
    console.debug("[AuthContext] Switching to guest mode...");
    
    // Use Supabase anonymous sign-in if available
    signInAnonymously().catch((error) => {
      console.error("[AuthContext] Failed to use Supabase anonymous sign-in, falling back to local guest mode:", error);
      
      // Fallback to local guest mode
      if (keystoreAuthMode === 'keystore') {
        setCurrentUser(null);
        setSessionPrivateKey(null);
      }
      setKeystoreAuthMode('guest');
      setError(null);
    });
    
    console.info("[AuthContext] Switched to guest mode.");
  }, [keystoreAuthMode, signInAnonymously]);

  // =====================================================================================
  // CONTEXT PROVIDER
  // =====================================================================================

  const contextValue: AuthContextType = {
    // General auth state
    authMode,
    isLoading,
    error,
    setError,
    
    // Auth state flags
    isAuthenticated,
    isGuest,
    isKeystoreAuthenticated,
    isSupabaseAuthenticated,
    
    // Keystore-specific properties and methods
    currentUser,
    createAccount,
    loginWithKeystore,
    signData,
    
    // Supabase-specific properties and methods
    supabaseUser,
    supabaseSession,
    profile,
    signInWithGitHub,
    signInWithMagicLink,
    signInAnonymously,
    updateUsername,
    refreshProfile,
    
    // Combined methods
    logout,
    switchToGuestMode,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped by AuthProvider.');
  }
  return context;
};
