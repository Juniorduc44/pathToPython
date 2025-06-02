/**
 * @file AuthContext.tsx
 * @version 1.0.0
 * @description Manages user authentication state and keystore-based self-custody logic.
 * This context handles guest mode, keystore generation, login, logout, and ensures
 * client-side cryptographic operations for user security and data sovereignty.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date May 31, 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// =====================================================================================
// CONSTANTS & CONFIGURATION
// =====================================================================================

const KEYSTORE_ALGORITHM_NAME = 'AES-GCM';
const KEYSTORE_KEY_LENGTH = 256; // AES-256
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH_ALGORITHM = 'SHA-256';
const ED25519_ALGORITHM_NAME = 'Ed25519'; // For key pair generation and signing

const SESSION_STORAGE_KEY = 'pythonQuestAuth';

// =====================================================================================
// TYPE DEFINITIONS & INTERFACES
// =====================================================================================

/**
 * @type AuthMode
 * @description Represents the current authentication status of the user.
 * - 'unauthenticated': No user is active, not even as a guest. Initial state.
 * - 'guest': User is interacting with the app without a keystore account. Progress is local.
 * - 'keystore': User is authenticated using their self-custody keystore file.
 */
export type AuthMode = 'unauthenticated' | 'guest' | 'keystore';

/**
 * @interface Keystore
 * @description Defines the structure of the downloadable/uploadable JSON keystore file.
 * This file contains the user's encrypted private key and their public key.
 */
export interface Keystore {
  publicKeyHex: string;         // User's public key (Ed25519), hex encoded
  encryptedPrivateKey: string;  // User's private key (Ed25519), AES-GCM encrypted, base64 encoded
  salt: string;                 // Salt used for PBKDF2 key derivation, base64 encoded
  iv: string;                   // Initialization Vector used for AES-GCM, base64 encoded
  version: string;              // Keystore version
  encryptionAlgorithm: string;  // e.g., "AES-GCM-256"
  pbkdf2Iterations: number;     // Iterations for PBKDF2
}

/**
 * @interface AuthUser
 * @description Represents the authenticated user's information.
 * For keystore users, this primarily includes their public key.
 */
export interface AuthUser {
  publicKeyHex: string; // User's public key, serving as their unique identifier
  // Potentially add a user-chosen display name in the future
}

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context provided to components.
 * Includes authentication state and methods to manage authentication.
 */
interface AuthContextType {
  authMode: AuthMode;
  currentUser: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // Derived: true if authMode is 'keystore'
  isGuest: boolean; // Derived: true if authMode is 'guest'
  createAccount: (password: string) => Promise<void>;
  loginWithKeystore: (keystoreFile: File, password: string) => Promise<void>;
  logout: () => void;
  switchToGuestMode: () => void;
  // Placeholder for challenge signing, demonstrating private key usability
  signData: (data: string) => Promise<string | null>; 
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

// =====================================================================================
// CONTEXT CREATION
// =====================================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================================================
// AUTH PROVIDER COMPONENT
// =====================================================================================

/**
 * @component AuthProvider
 * @description Provides authentication state and logic to its children via AuthContext.
 * Manages user sessions, keystore operations, and guest mode.
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Child components to be wrapped by the provider.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('unauthenticated');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for initial check
  const [error, setError] = useState<string | null>(null);

  // Store decrypted private key in memory only for the session
  const [sessionPrivateKey, setSessionPrivateKey] = useState<CryptoKey | null>(null);

  /**
   * @effect initializeAuth
   * @description On component mount, checks session storage for persisted authentication state.
   * This allows users to remain logged in (or in guest mode) across page reloads within the same session.
   */
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedAuth) {
        const { mode, user } = JSON.parse(storedAuth);
        if (mode === 'keystore' && user && user.publicKeyHex) {
          setAuthMode('keystore');
          setCurrentUser(user);
          // Note: Private key is NOT stored in sessionStorage. User would need to re-enter password
          // or re-upload keystore if we wanted full persistence across browser closing.
          // For now, if they were 'keystore', they become 'unauthenticated' on full browser close,
          // unless we add more sophisticated session management or keystore caching.
          // For this iteration, we'll keep it simple: session storage remembers mode and public ID.
        } else if (mode === 'guest') {
          setAuthMode('guest');
        } else {
          setAuthMode('unauthenticated');
        }
      } else {
        setAuthMode('unauthenticated'); // Default if nothing stored
      }
    } catch (e) {
      console.error("Error initializing auth state from session storage:", e);
      setAuthMode('unauthenticated'); // Fallback on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @effect persistAuthToSession
   * @description Persists critical (non-sensitive) authentication state to session storage
   * whenever `authMode` or `currentUser` changes.
   */
  useEffect(() => {
    if (!isLoading) { // Only persist after initial load
      try {
        if (authMode === 'keystore' && currentUser) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ mode: authMode, user: currentUser }));
        } else if (authMode === 'guest') {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ mode: authMode, user: null }));
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch(e) {
        console.error("Error persisting auth state to session storage:", e);
      }
    }
  }, [authMode, currentUser, isLoading]);


  // --- Cryptographic Helper Functions ---

  const generateEd25519KeyPair = async (): Promise<CryptoKeyPair> => {
    return window.crypto.subtle.generateKey(
      { name: ED25519_ALGORITHM_NAME },
      true, // extractable
      ['sign', 'verify']
    );
  };

  const deriveKeyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const masterKey = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: PBKDF2_HASH_ALGORITHM,
      },
      masterKey,
      { name: KEYSTORE_ALGORITHM_NAME, length: KEYSTORE_KEY_LENGTH },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  };

  const encryptPrivateKey = async (derivedKey: CryptoKey, privateKeyData: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> => {
    return window.crypto.subtle.encrypt(
      { name: KEYSTORE_ALGORITHM_NAME, iv: iv },
      derivedKey,
      privateKeyData
    );
  };

  const decryptPrivateKey = async (derivedKey: CryptoKey, encryptedPrivateKeyData: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> => {
    return window.crypto.subtle.decrypt(
      { name: KEYSTORE_ALGORITHM_NAME, iv: iv },
      derivedKey,
      encryptedPrivateKeyData
    );
  };

  const exportCryptoKeyToRaw = async (key: CryptoKey): Promise<ArrayBuffer> => {
    return window.crypto.subtle.exportKey('raw', key);
  };
  
  const importEd25519PrivateKeyFromRaw = async (keyData: ArrayBuffer): Promise<CryptoKey> => {
    return window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: ED25519_ALGORITHM_NAME },
        true, // extractable
        ['sign']
    );
  };


  // --- Core Authentication Methods ---

  /**
   * @function createAccount
   * @description Generates a new cryptographic key pair, encrypts the private key with the user's password,
   * creates a downloadable keystore file, and sets the user's authentication state.
   * @param {string} password - The user's chosen password for encrypting the keystore.
   */
  const createAccount = useCallback(async (password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const keyPair = await generateEd25519KeyPair();
      const publicKeyHex = arrayBufferToHex(await exportCryptoKeyToRaw(keyPair.publicKey as CryptoKey));
      const privateKeyRaw = await exportCryptoKeyToRaw(keyPair.privateKey as CryptoKey);

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM standard IV size

      const derivedKey = await deriveKeyFromPassword(password, salt);
      const encryptedPrivateKeyArrBuffer = await encryptPrivateKey(derivedKey, privateKeyRaw, iv);
      
      const keystoreData: Keystore = {
        publicKeyHex,
        encryptedPrivateKey: arrayBufferToBase64(encryptedPrivateKeyArrBuffer),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
        version: "1.0",
        encryptionAlgorithm: `${KEYSTORE_ALGORITHM_NAME}-${KEYSTORE_KEY_LENGTH}`,
        pbkdf2Iterations: PBKDF2_ITERATIONS,
      };

      // Trigger download
      const keystoreString = JSON.stringify(keystoreData, null, 2);
      const blob = new Blob([keystoreString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PythonQuest_Keystore_${publicKeyHex.substring(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const user: AuthUser = { publicKeyHex };
      setCurrentUser(user);
      setAuthMode('keystore');
      setSessionPrivateKey(keyPair.privateKey); // Store decrypted private key in memory for this session

      // Note: ProgressContext will continue using its existing localStorage data.
      // If guest progress existed, it's now implicitly associated with this new account for this session.
      // If the user logs out and logs back in with this keystore, ProgressContext will load the same data.

    } catch (e: any) {
      console.error("Error creating account:", e);
      setError(`Account creation failed: ${e.message || 'Unknown error'}`);
      // Rollback any partial state changes if necessary
      setAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @function loginWithKeystore
   * @description Loads a keystore file, prompts for a password, decrypts the private key,
   * and authenticates the user for the current session.
   * @param {File} keystoreFile - The keystore file uploaded by the user.
   * @param {string} password - The user's password to decrypt the keystore.
   */
  const loginWithKeystore = useCallback(async (keystoreFile: File, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const keystoreString = await keystoreFile.text();
      const keystoreData: Keystore = JSON.parse(keystoreString);

      // Basic validation
      if (!keystoreData.publicKeyHex || !keystoreData.encryptedPrivateKey || !keystoreData.salt || !keystoreData.iv) {
        throw new Error("Invalid or corrupted keystore file format.");
      }

      const salt = base64ToArrayBuffer(keystoreData.salt);
      const iv = base64ToArrayBuffer(keystoreData.iv);
      const encryptedPrivateKeyData = base64ToArrayBuffer(keystoreData.encryptedPrivateKey);

      const derivedKey = await deriveKeyFromPassword(password, salt);
      const privateKeyRaw = await decryptPrivateKey(derivedKey, encryptedPrivateKeyData, iv);
      
      const privateKey = await importEd25519PrivateKeyFromRaw(privateKeyRaw);

      // "Challenge-Response" simulation: If decryption is successful, we have the private key.
      // A real system would involve a server sending a challenge to sign.
      // Here, we can just confirm we can use the key.
      // We'll store the private key in session memory.

      const user: AuthUser = { publicKeyHex: keystoreData.publicKeyHex };
      setCurrentUser(user);
      setAuthMode('keystore');
      setSessionPrivateKey(privateKey);

    } catch (e: any) {
      console.error("Error logging in with keystore:", e);
      // More specific error for bad password (decryption failure)
      if (e.name === 'OperationError' || (e.message && e.message.toLowerCase().includes('decryption failed'))) {
        setError("Login failed: Invalid password or corrupted keystore.");
      } else {
        setError(`Login failed: ${e.message || 'Unknown error'}`);
      }
      setAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @function logout
   * @description Logs out the current user, clearing authentication state and any session-stored private key.
   */
  const logout = useCallback((): void => {
    setAuthMode('unauthenticated');
    setCurrentUser(null);
    setSessionPrivateKey(null);
    setError(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    // Note: Progress data in localStorage (managed by ProgressContext) is NOT cleared on logout.
    // This allows a user to log out, become a guest, and still see their "guest" progress.
    // If they log back into the *same* keystore, they'll see that progress again.
  }, []);

  /**
   * @function switchToGuestMode
   * @description Switches the authentication mode to 'guest'. User progress continues to be tracked locally.
   */
  const switchToGuestMode = useCallback((): void => {
    if (authMode === 'keystore') { // If they were logged in, log them out first
        setCurrentUser(null);
        setSessionPrivateKey(null);
    }
    setAuthMode('guest');
    setError(null);
  }, [authMode]);

  /**
   * @function signData
   * @description Signs a string message using the session's private key (if available).
   * This demonstrates the usability of the decrypted private key.
   * @param {string} dataString - The string data to sign.
   * @returns {Promise<string | null>} The signature as a hex string, or null if not authenticated or error.
   */
  const signData = useCallback(async (dataString: string): Promise<string | null> => {
    if (!sessionPrivateKey || authMode !== 'keystore') {
      setError("Not authenticated with a keystore to sign data.");
      return null;
    }
    try {
      const dataBuffer = new TextEncoder().encode(dataString);
      const signatureBuffer = await window.crypto.subtle.sign(
        { name: ED25519_ALGORITHM_NAME },
        sessionPrivateKey,
        dataBuffer
      );
      return arrayBufferToHex(signatureBuffer);
    } catch (e: any) {
      console.error("Error signing data:", e);
      setError(`Signing failed: ${e.message || 'Unknown error'}`);
      return null;
    }
  }, [sessionPrivateKey, authMode]);


  const contextValue: AuthContextType = {
    authMode,
    currentUser,
    isLoading,
    error,
    isAuthenticated: authMode === 'keystore' && !!currentUser,
    isGuest: authMode === 'guest',
    createAccount,
    loginWithKeystore,
    logout,
    switchToGuestMode,
    signData,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// =====================================================================================
// CUSTOM HOOK
// =====================================================================================

/**
 * @function useAuth
 * @description Custom hook to access the AuthContext.
 * Provides a convenient way for components to consume authentication state and methods.
 * @throws {Error} If used outside of an `AuthProvider`.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped by AuthProvider.');
  }
  return context;
};
