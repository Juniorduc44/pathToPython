# Python Quest - Phase 2: Self-Custody Keystore Authentication System

**Document Version:** 1.0
**Date:** June 2, 2025
**Project:** Python Quest - A Gamified Python Learning Platform
**Lead Development Team:** Factory AI Development Team

## 1. Overview

Phase 2 of Python Quest development introduces a **robust, self-custody keystore authentication system**, fundamentally enhancing user data sovereignty and platform security. This implementation empowers users by giving them direct control over their authentication credentials, moving away from traditional centralized identity management.

The core objectives achieved in this phase are:
*   **Implementation of a User-Controlled Keystore Model:** Based on the principles outlined in `keyStore_logins_00.md`, users now manage their own cryptographic keys.
*   **Secure Account Creation & Login:** Users can create new accounts, generating an encrypted keystore file, or log in using an existing keystore.
*   **Guest Access with Upgrade Path:** New users can try the platform as guests, with their progress saved locally. They can later create a keystore account, seamlessly migrating their guest progress.
*   **Enhanced Security & Privacy:** Private keys are never stored on any server and are encrypted client-side using user-defined passwords.

This phase lays the groundwork for a truly user-centric platform, prioritizing security, privacy, and data ownership, while preparing for future integrations like Bitcoin LNURL authentication.

## 2. Authentication Architecture

The authentication system is built upon client-side cryptography, ensuring that sensitive key material remains under the user's control at all times.

*   **Client-Side Cryptography:** All cryptographic operations (key generation, encryption, decryption, signing preparation) occur directly within the user's browser using the Web Crypto API.
*   **Cryptographic Keys:**
    *   **Key Pair Generation:** Ed25519 elliptic curve cryptography is used to generate unique public/private key pairs for each user. Ed25519 is chosen for its security and performance characteristics suitable for digital signatures.
    *   **Public Key:** Serves as the user's unique, non-sensitive identifier within the system.
    *   **Private Key:** The ultimate credential, kept secret and used for proving identity (e.g., signing challenges). It is **never transmitted or stored unencrypted by any server**.
*   **Keystore File (`.json`):**
    *   A downloadable JSON file that acts as the user's portable, encrypted identity.
    *   **Contents:**
        *   `publicKeyHex`: The user's Ed25519 public key, hex-encoded.
        *   `encryptedPrivateKey`: The user's Ed25519 private key, encrypted using AES-256-GCM and then base64-encoded.
        *   `salt`: A unique, randomly generated salt (base64-encoded) used for PBKDF2 key derivation. This protects against rainbow table attacks on passwords.
        *   `iv`: A unique, randomly generated Initialization Vector (base64-encoded) used for AES-GCM encryption. Essential for semantic security.
        *   `version`: Keystore format version (e.g., "1.0").
        *   `encryptionAlgorithm`: Specifies the algorithm used (e.g., "AES-GCM-256").
        *   `pbkdf2Iterations`: Number of iterations used for PBKDF2 (e.g., 100,000), increasing resistance to brute-force attacks.
*   **Private Key Encryption & Decryption:**
    *   **Key Derivation Function (KDF):** PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256 is used to derive a strong cryptographic key from the user's chosen password and the unique salt.
    *   **Encryption Algorithm:** AES-256-GCM (Advanced Encryption Standard in Galois/Counter Mode) is used to encrypt the raw private key. GCM provides both confidentiality and authenticity.
*   **Authentication Flow (Client-Side):**
    *   **Account Creation:**
        1.  A new Ed25519 key pair is generated in the browser.
        2.  The user provides a strong password.
        3.  A random salt and IV are generated.
        4.  The password and salt are used with PBKDF2 to derive an encryption key.
        5.  The private key is encrypted using AES-256-GCM with the derived key and IV.
        6.  The `publicKeyHex`, `encryptedPrivateKey`, `salt`, `iv`, and metadata are packaged into a JSON keystore file, which the user downloads.
        7.  The user is logged in for the current session; the decrypted private key is held in memory.
    *   **Login:**
        1.  The user uploads their keystore file and enters their password.
        2.  The salt, IV, and encrypted private key are extracted from the keystore.
        3.  The password and salt are used with PBKDF2 to re-derive the encryption key.
        4.  The derived key and IV are used to decrypt the private key using AES-256-GCM.
        5.  If decryption is successful (indicating correct password), the user is logged in. The decrypted private key is held in memory for the session.
    *   **Challenge-Response (Conceptual for this phase):** While a full server-side challenge-response isn't implemented for every action post-login in this phase, the decrypted private key held in session memory is ready to sign challenges. The `signData` function in `AuthContext` demonstrates this capability. A valid signature proves possession of the private key without exposing it.

## 3. User Experience (UX) & Flows

The user interface is designed to be intuitive, secure, and flexible, catering to different user preferences.

*   **Initial Landing (`LoginPage.tsx`):**
    *   The application now starts at a dedicated login page.
    *   Presents three clear options to the user via a tabbed interface.
*   **Authentication Options:**
    1.  **Login with Keystore:**
        *   Users select their downloaded `.json` keystore file.
        *   Enter the password they used during account creation.
        *   On success, they are logged into the dashboard. Their progress (associated with their public key) is active.
        *   Error messages guide users for incorrect passwords or invalid files.
    2.  **Create Account:**
        *   Users choose a strong password and confirm it (minimum 8 characters).
        *   Client-side key generation and encryption occur.
        *   A keystore file is automatically generated and downloaded to their device. Users are instructed to back this up securely.
        *   The user is immediately logged in. Any existing guest progress from the current browser session is seamlessly associated with this new account.
    3.  **Try as Guest:**
        *   Users can bypass account creation/login and directly access the learning platform.
        *   Progress is saved locally in the browser's `localStorage`.
        *   This mode allows users to experience Python Quest without immediate commitment.
*   **Guest to Keystore Account Upgrade:**
    *   While in guest mode, a "Create Account" button is prominently displayed in the dashboard header.
    *   Clicking this button opens a modal dialog for password input (similar to the "Create Account" tab on the login page).
    *   Upon successful password entry and keystore generation/download, the user's `authMode` transitions from `guest` to `keystore`.
    *   Crucially, all progress made as a guest (stored in `localStorage`) is automatically retained and associated with the newly created keystore account for the current session and future logins with that keystore.
*   **Session Management:**
    *   `sessionStorage` is used to maintain `authMode` and `currentUser.publicKeyHex` across page reloads within the same browser session. This provides a smoother experience for logged-in users.
    *   The decrypted private key is **only held in JavaScript memory** during an active session and is **not** stored in `sessionStorage` or `localStorage` for security reasons.
*   **Logout:**
    *   Clears the in-memory private key, `currentUser` details, and removes the authentication state from `sessionStorage`.
    *   Redirects the user to the `LoginPage`.
    *   `localStorage` (containing learning progress) is intentionally **not** cleared on logout. This allows a user to log out, potentially use guest mode, and then log back in (or create a new account) while retaining access to that locally stored progress if desired.
*   **User Interface Feedback:**
    *   Loading indicators are shown during cryptographic operations.
    *   Clear error messages are provided for incorrect passwords, invalid files, or other issues.
    *   The dashboard header dynamically updates to reflect authentication status (e.g., showing "Create Account" for guests, or "Logout" and user ID for keystore users).

## 4. Security Features

Security is paramount in the keystore model, with an emphasis on user control and client-side protection.

*   **Self-Custody of Keys:** The user is the sole custodian of their encrypted private key via the keystore file.
*   **Client-Side Cryptographic Operations:** All sensitive operations (key generation, private key encryption/decryption) happen within the user's browser. The unencrypted private key never leaves the user's device/browser memory.
*   **Strong Encryption Standards:**
    *   **AES-256-GCM:** Used for encrypting the private key. AES-256 is a widely trusted symmetric encryption algorithm. GCM mode provides both confidentiality (encryption) and authenticity (integrity protection).
*   **Robust Key Derivation:**
    *   **PBKDF2 with SHA-256:** Protects the user's password against brute-force and dictionary attacks when deriving the encryption key.
    *   **High Iteration Count:** `PBKDF2_ITERATIONS` is set to 100,000, significantly increasing the computational cost for attackers.
    *   **Unique Salt:** A cryptographically random salt is generated for each keystore, ensuring that identical passwords result in different derived keys and encrypted private keys.
*   **No Server-Side Storage of Sensitive Credentials:** The platform does not store user passwords, password hashes, or unencrypted/encrypted private keys. This drastically reduces the impact of potential server-side breaches.
*   **Secure Randomness:** `window.crypto.getRandomValues` is used for generating salts and IVs, ensuring cryptographic-quality randomness.
*   **HTTPS (Assumed):** All application traffic must be served over HTTPS to protect data in transit, including the upload of keystore files (though the sensitive part is already encrypted).

## 5. Integration with Existing Systems

The new authentication system is designed to integrate smoothly with the existing components of Python Quest.

*   **`ProgressContext.tsx` (Learning Progress):**
    *   The `ProgressContext` continues to manage learning progress (completed lessons, XP, levels) using `localStorage`.
    *   **Guest Mode:** Progress is saved to `localStorage` as before.
    *   **Keystore Account Creation/Login:** When a user creates an account or logs in with a keystore, the `ProgressContext` implicitly uses the same `localStorage` data if the action occurs within the same browser session where guest progress was made.
    *   **Future Consideration:** For multi-device progress sync or distinct progress per user on the same browser, `ProgressContext` could be enhanced to scope its `localStorage` key by `currentUser.publicKeyHex` (from `AuthContext`). In the current implementation, progress is tied to the browser's `localStorage`.
*   **`ThemeContext.tsx` (UI Theme):**
    *   Operates independently of the authentication system. Theme preferences are managed separately.
*   **Application Routing (`src/pages/Index.tsx`):**
    *   The main application entry point (`Index.tsx`) now wraps its content with `AuthProvider`.
    *   An `AppContentRouter` component within `Index.tsx` uses the `useAuth()` hook to check `authMode`.
    *   If `authMode` is `'unauthenticated'`, the `LoginPage` component is rendered.
    *   If `authMode` is `'guest'` or `'keystore'`, the main `Dashboard` component (which itself is wrapped by `ProgressProvider`) is rendered.
*   **UI Elements in Dashboard:**
    *   The header within the `Dashboard` component now dynamically displays elements based on `authMode`:
        *   **Guest Mode:** Shows a "Create Account" button (triggering the upgrade modal) and an informational alert about guest mode.
        *   **Keystore Mode:** Shows a "Logout" button and a truncated version of the user's `publicKeyHex` as an identifier.

## 6. Files Added/Modified

This phase involved the creation of new core components and modifications to integrate the authentication flow.

*   **New Files:**
    *   `src/contexts/AuthContext.tsx`: Contains all logic for authentication state, keystore operations (generation, encryption, decryption), user session management, and cryptographic utilities.
    *   `src/components/LoginPage.tsx`: The new UI entry point for the application, providing tabs for login, account creation, and guest access.
*   **Modified Files:**
    *   `src/pages/Index.tsx`:
        *   Wrapped the entire application content with `AuthProvider`.
        *   Implemented `AppContentRouter` to conditionally render `LoginPage` or the `Dashboard` based on authentication status.
        *   Modified the `Dashboard` component's header to include dynamic elements for logout (for keystore users) and an "Create Account" modal trigger (for guest users wishing to upgrade).
        *   Integrated logic for the guest-to-keystore account upgrade process, ensuring progress preservation.
    *   *(No direct modifications were made to `LessonView.tsx`, `ProgressBar.tsx`, or `lessons.ts` for authentication itself, but they are consumed by the authenticated or guest sessions.)*

## 7. Testing Instructions

Thorough testing is crucial to ensure the security and functionality of the new authentication system.

1.  **Guest Mode Functionality:**
    *   Load the application. You should be presented with the `LoginPage`.
    *   Select the "Guest" tab and click "Continue as Guest".
    *   Verify you are taken to the main `Dashboard`.
    *   Complete a few lessons. Check that progress (XP, level, completed lessons) is updated on the UI.
    *   Verify progress is saved in `localStorage` (key: `pythonProgress`).
    *   Reload the browser page. Verify you remain in guest mode and progress is persisted.
    *   Note the "Create Account" button in the header and the guest mode alert.

2.  **Account Creation (from Guest Mode):**
    *   While in guest mode with some progress made:
        *   Click the "Create Account" button in the header.
        *   The "Secure Your Progress" modal should appear.
        *   Test password validation:
            *   Passwords not matching.
            *   Password less than 8 characters.
        *   Enter a valid password and confirm it.
        *   Click "Create Account & Download Keystore".
        *   Verify a `.json` keystore file is downloaded. **Save this file securely.**
        *   Verify the modal closes and the UI updates to reflect a logged-in (keystore) state (e.g., "Logout" button appears, user ID shown).
        *   Verify that the learning progress made as a guest is still present and associated with this new account.

3.  **Account Creation (from Login Page):**
    *   If logged in, log out first to return to the `LoginPage`.
    *   Select the "Create" tab.
    *   Enter a strong password (and confirm).
    *   Click "Create Account & Download Keystore".
    *   Verify keystore download and automatic login to the `Dashboard`.
    *   Start with fresh progress (as no prior guest session existed for this flow directly).

4.  **Logout Functionality:**
    *   While logged in with a keystore account:
        *   Click the "Logout" button in the header.
        *   Verify you are redirected to the `LoginPage`.
        *   Verify `sessionStorage` (key: `pythonQuestAuth`) is cleared.
        *   Verify `localStorage` (key: `pythonProgress`) is **not** cleared.

5.  **Login with Keystore:**
    *   From the `LoginPage`, select the "Login" tab.
    *   **Test Correct Login:**
        *   Upload a previously downloaded keystore file.
        *   Enter the correct password for that keystore.
        *   Click "Unlock Keystore".
        *   Verify successful login and redirection to the `Dashboard`.
        *   Verify that the learning progress associated with that keystore's identity (via `localStorage` from previous sessions/guest upgrade) is loaded.
    *   **Test Incorrect Password:**
        *   Upload a valid keystore file.
        *   Enter an incorrect password.
        *   Verify an appropriate error message is displayed (e.g., "Invalid password or corrupted keystore").
    *   **Test Invalid/Corrupted Keystore File:**
        *   Attempt to upload a non-JSON file or a malformed JSON file.
        *   Verify an error message regarding invalid file format.
    *   **Test Keystore for Different Account:** If you have multiple keystores, test logging out and logging in with a different one to ensure progress isolation (if `ProgressContext` were scoped by user ID; currently, it would show the same `localStorage` progress).

6.  **Session Persistence (Keystore Mode):**
    *   Log in with a keystore account.
    *   Reload the browser page.
    *   Verify you remain logged in (i.e., you are taken directly to the `Dashboard`, not the `LoginPage`). Check `sessionStorage` for `pythonQuestAuth`.
    *   *(Note: The actual private key is not in `sessionStorage`, so actions requiring it, like the `signData` placeholder, would still work as `sessionPrivateKey` is re-established if the session is active or would need re-authentication for a true challenge).*

7.  **Error States and UI Feedback:**
    *   Observe loading indicators during cryptographic operations (account creation, login).
    *   Ensure all error messages are clear, user-friendly, and displayed appropriately.

## 8. Future Roadmap & Considerations

This self-custody keystore system provides a strong foundation. Future enhancements can include:

*   **Bitcoin LNURL Authentication:** Integrate LNURL-auth as an alternative or complementary authentication method, offering users even more choice and leveraging modern Bitcoin-based identity solutions.
*   **Server-Side Progress Sync (Optional & Encrypted):**
    *   For users who desire cross-device progress synchronization, an optional server-side backup could be offered.
    *   Progress data could be encrypted client-side using a key derived from the user's keystore/password before being sent to a server, ensuring the server never sees plaintext progress data. The public key would serve as the user's identifier.
*   **Enhanced Keystore Management:**
    *   Guidance on secure keystore backup practices.
    *   Potential for password change functionality (would require re-encrypting the private key).
    *   Import/export of progress data tied to a keystore.
*   **Multi-Device Keystore Usage:** Clear instructions and best practices for users wanting to use their keystore file on multiple devices.
*   **Full Challenge-Response for Sensitive Actions:** Beyond initial login, implement server-issued challenges that must be signed client-side using the session's private key for critical operations (if any are added that require such proof).
*   **Hardware Wallet Integration:** For advanced users, explore potential integration with hardware wallets for signing operations, further enhancing private key security.
*   **Progress Scoping by User ID:** If true multi-user support on a single browser is desired (where each user has distinct progress even if they use the same browser), `ProgressContext` would need to be modified to scope its `localStorage` data using the `currentUser.publicKeyHex`.

This phase successfully delivers a secure, user-centric authentication model, significantly elevating the Python Quest platform's capabilities and trustworthiness.
