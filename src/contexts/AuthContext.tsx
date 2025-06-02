/**
 * @file AuthContext.tsx
 * @version 1.2.0-ecdsa-progress
 * @description Manages user authentication state and keystore-based self-custody logic.
 * This context handles guest mode, keystore generation, login, logout, and ensures
 * client-side cryptographic operations for user security and data sovereignty.
 * Keystore files now also store user progress metadata.
 * Uses ECDSA P-256 for key pairs and AES-GCM for keystore encryption.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date June 2, 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// =====================================================================================
// CONSTANTS & CONFIGURATION
// =====================================================================================

const KEYSTORE_ENCRYPTION_ALGORITHM_NAME = 'AES-GCM';
const KEYSTORE_KEY_LENGTH = 256; // AES-256
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH_ALGORITHM = 'SHA-256';

const ASYMMETRIC_KEY_ALGORITHM = { name: "ECDSA", namedCurve: "P-256" };
const SIGNATURE_ALGORITHM = { name: "ECDSA", hash: { name: "SHA-256" } };
const KEYSTORE_VERSION = "2.1-ecdsa-progress"; // Version to indicate ECDSA and progress data

const SESSION_STORAGE_KEY = 'pythonQuestAuth';

// =====================================================================================
// TYPE DEFINITIONS & INTERFACES
// =====================================================================================

export type AuthMode = 'unauthenticated' | 'guest' | 'keystore';

/**
 * @interface ProgressData
 * @description Defines the structure for storing user's learning progress.
 */
export interface ProgressData {
  completedLessons: string[]; // Array of completed lesson IDs
  xp: number;
  level: number;
}

/**
 * @interface KeystoreCryptoData
 * @description Stores the cryptographic parts of a loaded keystore, needed for re-saving.
 */
interface KeystoreCryptoData {
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
  pbkdf2Iterations: number;
  keyAlgorithm: string;
  encryptionAlgorithm: string;
}

export interface Keystore {
  publicKeyHex: string;
  version: string;
  // Crypto parts
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
  pbkdf2Iterations: number;
  keyAlgorithm: string;
  encryptionAlgorithm: string;
  // Progress data
  progressData?: ProgressData; // Optional for backward compatibility with older keystores
}

export interface AuthUser {
  publicKeyHex: string;
}

interface AuthContextType {
  authMode: AuthMode;
  currentUser: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  setError: (message: string | null) => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  initialProgressFromKeystore: ProgressData | null; // To pass to ProgressContext on login
  createAccount: (password: string, initialProgress?: ProgressData) => Promise<void>;
  loginWithKeystore: (keystoreFile: File, password: string) => Promise<void>;
  logout: () => void;
  switchToGuestMode: () => void;
  signData: (data: string) => Promise<string | null>;
  saveProgressToKeystore: (currentProgress: ProgressData) => Promise<void>;
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
  const [authMode, setAuthMode] = useState<AuthMode>('unauthenticated');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionPrivateKey, setSessionPrivateKey] = useState<CryptoKey | null>(null);
  // Store crypto parts of the loaded keystore for re-saving with updated progress
  const [currentKeystoreCryptoData, setCurrentKeystoreCryptoData] = useState<KeystoreCryptoData | null>(null);
  // Used to pass progress data from keystore to ProgressContext upon login
  const [initialProgressFromKeystore, setInitialProgressFromKeystore] = useState<ProgressData | null>(null);


  useEffect(() => {
    setIsLoading(true);
    console.debug("[AuthContext] Initializing auth state from session storage...");
    try {
      const storedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedAuth) {
        const { mode, user, keystoreCrypto } = JSON.parse(storedAuth);
        if (mode === 'keystore' && user && user.publicKeyHex) {
          setAuthMode('keystore');
          setCurrentUser(user);
          if (keystoreCrypto) { // Restore crypto data if available
            setCurrentKeystoreCryptoData(keystoreCrypto);
          }
          console.debug("[AuthContext] Keystore session restored (publicKey and cryptoData).");
        } else if (mode === 'guest') {
          setAuthMode('guest');
          console.debug("[AuthContext] Guest session restored.");
        } else {
          setAuthMode('unauthenticated');
        }
      } else {
        setAuthMode('unauthenticated');
        console.debug("[AuthContext] No session state found, defaulting to unauthenticated.");
      }
    } catch (e) {
      console.error("[AuthContext] Error initializing auth state:", e);
      setAuthMode('unauthenticated');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.debug("[AuthContext] Persisting auth state to session storage:", { authMode, currentUser, currentKeystoreCryptoData });
      try {
        if (authMode === 'keystore' && currentUser && currentKeystoreCryptoData) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ mode: authMode, user: currentUser, keystoreCrypto: currentKeystoreCryptoData }));
        } else if (authMode === 'guest') {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ mode: authMode, user: null, keystoreCrypto: null }));
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch(e) {
        console.error("[AuthContext] Error persisting auth state:", e);
      }
    }
  }, [authMode, currentUser, isLoading, currentKeystoreCryptoData]);

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
        true, 
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
      throw e; 
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
          true, 
          ['sign']
      );
      console.debug("[AuthContext] ECDSA private key imported successfully.");
      return privateKey;
    } catch (e) {
      console.error("[AuthContext] Error importing ECDSA private key:", e);
      throw e;
    }
  };

  const createAccount = useCallback(async (password: string, initialProgress?: ProgressData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setInitialProgressFromKeystore(null);
    console.debug("[AuthContext] Starting account creation with initial progress:", initialProgress);
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
      
      const cryptoData: KeystoreCryptoData = {
        encryptedPrivateKey: arrayBufferToBase64(encryptedPrivateKeyArrBuffer),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
        pbkdf2Iterations: PBKDF2_ITERATIONS,
        keyAlgorithm: "ECDSA-P256",
        encryptionAlgorithm: `${KEYSTORE_ENCRYPTION_ALGORITHM_NAME}-${KEYSTORE_KEY_LENGTH}`,
      };

      const defaultProgress: ProgressData = { completedLessons: [], xp: 0, level: 1 };
      const progressToSave = initialProgress || defaultProgress;

      const keystoreData: Keystore = {
        publicKeyHex,
        version: KEYSTORE_VERSION,
        ...cryptoData,
        progressData: progressToSave,
      };

      const keystoreString = JSON.stringify(keystoreData, null, 2);
      const blob = new Blob([keystoreString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PythonQuest_Keystore_${KEYSTORE_VERSION}_${publicKeyHex.substring(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.info("[AuthContext] Keystore file downloaded.");

      const user: AuthUser = { publicKeyHex };
      setCurrentUser(user);
      setAuthMode('keystore');
      setSessionPrivateKey(keyPair.privateKey);
      setCurrentKeystoreCryptoData(cryptoData); // Store crypto parts for re-saving
      setInitialProgressFromKeystore(progressToSave); // Signal ProgressContext to load this
      console.info("[AuthContext] Account created successfully. User is keystore authenticated.");

    } catch (e: any) {
      console.error("[AuthContext] Error creating account:", e, e.stack);
      setError(`Account creation failed: ${e.message || 'Unknown cryptographic error'}`);
      setAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
      setCurrentKeystoreCryptoData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithKeystore = useCallback(async (keystoreFile: File, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setInitialProgressFromKeystore(null);
    console.debug("[AuthContext] Starting login with keystore...");
    try {
      const keystoreString = await keystoreFile.text();
      const keystoreData: Keystore = JSON.parse(keystoreString);

      if (keystoreData.version !== KEYSTORE_VERSION || keystoreData.keyAlgorithm !== "ECDSA-P256") {
        console.warn("[AuthContext] Keystore version or algorithm mismatch.", keystoreData);
        throw new Error(`Invalid keystore. Expected version ${KEYSTORE_VERSION} with ECDSA-P256.`);
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
      setAuthMode('keystore');
      setSessionPrivateKey(privateKey);
      
      const cryptoData: KeystoreCryptoData = {
        encryptedPrivateKey: keystoreData.encryptedPrivateKey,
        salt: keystoreData.salt,
        iv: keystoreData.iv,
        pbkdf2Iterations: keystoreData.pbkdf2Iterations,
        keyAlgorithm: keystoreData.keyAlgorithm,
        encryptionAlgorithm: keystoreData.encryptionAlgorithm,
      };
      setCurrentKeystoreCryptoData(cryptoData);

      const progressToLoad = keystoreData.progressData || { completedLessons: [], xp: 0, level: 1 };
      setInitialProgressFromKeystore(progressToLoad); // Signal ProgressContext
      console.info("[AuthContext] Login successful. User is keystore authenticated. Progress from keystore:", progressToLoad);

    } catch (e: any) {
      console.error("[AuthContext] Error logging in with keystore:", e, e.stack);
      if (e.name === 'OperationError' || (e.message && (e.message.toLowerCase().includes('decryption failed') || e.message.toLowerCase().includes('tag doesn\'t match')))) {
        setError("Login failed: Invalid password or corrupted keystore.");
      } else {
        setError(`Login failed: ${e.message || 'Unknown error during login'}`);
      }
      setAuthMode('unauthenticated');
      setCurrentUser(null);
      setSessionPrivateKey(null);
      setCurrentKeystoreCryptoData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProgressToKeystore = useCallback(async (currentProgress: ProgressData): Promise<void> => {
    if (authMode !== 'keystore' || !currentUser || !currentKeystoreCryptoData || !sessionPrivateKey) {
      setError("Cannot save progress: Not authenticated with a keystore or essential data missing.");
      console.warn("[AuthContext] Save progress aborted: Not in keystore mode or missing data.");
      return;
    }
    setIsLoading(true);
    setError(null);
    console.debug("[AuthContext] Saving progress to keystore...");

    try {
      // We use the existing encrypted private key, salt, IV. No re-encryption of private key needed.
      const keystoreData: Keystore = {
        publicKeyHex: currentUser.publicKeyHex,
        version: KEYSTORE_VERSION,
        encryptedPrivateKey: currentKeystoreCryptoData.encryptedPrivateKey,
        salt: currentKeystoreCryptoData.salt,
        iv: currentKeystoreCryptoData.iv,
        pbkdf2Iterations: currentKeystoreCryptoData.pbkdf2Iterations,
        keyAlgorithm: currentKeystoreCryptoData.keyAlgorithm,
        encryptionAlgorithm: currentKeystoreCryptoData.encryptionAlgorithm,
        progressData: currentProgress,
      };

      const keystoreString = JSON.stringify(keystoreData, null, 2);
      const blob = new Blob([keystoreString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PythonQuest_Keystore_${KEYSTORE_VERSION}_${currentUser.publicKeyHex.substring(0, 8)}_updated.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.info("[AuthContext] Updated keystore file with progress downloaded.");
      // Optionally, provide user feedback like a toast notification.

    } catch (e: any) {
      console.error("[AuthContext] Error saving progress to keystore:", e, e.stack);
      setError(`Failed to save progress: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [authMode, currentUser, currentKeystoreCryptoData, sessionPrivateKey]);


  const logout = useCallback((): void => {
    console.debug("[AuthContext] Logging out...");
    setAuthMode('unauthenticated');
    setCurrentUser(null);
    setSessionPrivateKey(null);
    setCurrentKeystoreCryptoData(null);
    setInitialProgressFromKeystore(null);
    setError(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    console.info("[AuthContext] User logged out.");
  }, []);

  const switchToGuestMode = useCallback((): void => {
    console.debug("[AuthContext] Switching to guest mode...");
    if (authMode === 'keystore') { // Clear keystore specific states if switching from keystore
        setCurrentUser(null);
        setSessionPrivateKey(null);
        setCurrentKeystoreCryptoData(null);
        setInitialProgressFromKeystore(null); 
    }
    setAuthMode('guest');
    setError(null);
    console.info("[AuthContext] Switched to guest mode.");
  }, [authMode]);

  const signData = useCallback(async (dataString: string): Promise<string | null> => {
    if (!sessionPrivateKey || authMode !== 'keystore') {
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
  }, [sessionPrivateKey, authMode]);

  const contextValue: AuthContextType = {
    authMode,
    currentUser,
    isLoading,
    error,
    setError, 
    isAuthenticated: authMode === 'keystore' && !!currentUser,
    isGuest: authMode === 'guest',
    initialProgressFromKeystore,
    createAccount,
    loginWithKeystore,
    logout,
    switchToGuestMode,
    signData,
    saveProgressToKeystore,
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
