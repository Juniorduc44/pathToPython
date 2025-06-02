/**
 * @file LoginPage.tsx
 * @version 1.1.0
 * @description Main login and account creation page for Python Quest.
 * Offers users options to log in with a keystore, create a new self-custody account,
 * or try the platform as a guest. Emphasizes user data sovereignty and security.
 * Includes password reveal functionality for improved UX.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date June 2, 2025
 */

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyRound, UserPlus, ShieldCheck, UploadCloud, LogIn, PlayCircle, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';

const LoginPage: React.FC = () => {
  const { createAccount, loginWithKeystore, switchToGuestMode, isLoading, error: authError, setError: setAuthError } = useAuth();

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("login");

  // State for Create Account form
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for Login with Keystore form
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const clearLocalErrors = () => {
    setCreateError(null);
    setLoginError(null);
    if (setAuthError) setAuthError(null); // Clear global auth error if method is available
  };
  
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    clearLocalErrors();
    // Reset form fields when switching tabs for a cleaner experience
    setCreatePassword('');
    setConfirmPassword('');
    setKeystoreFile(null);
    const fileInput = document.getElementById('keystoreFile') as HTMLInputElement;
    if (fileInput) fileInput.value = ''; // Reset file input
    setLoginPassword('');
  };


  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    clearLocalErrors();
    if (createPassword !== confirmPassword) {
      setCreateError("Passwords do not match.");
      return;
    }
    if (createPassword.length < 8) {
      setCreateError("Password must be at least 8 characters long.");
      return;
    }
    await createAccount(createPassword);
    // AuthContext will handle navigation or state change on success
    // Error is handled by authError from context
  };

  const handleLoginWithKeystore = async (e: FormEvent) => {
    e.preventDefault();
    clearLocalErrors();
    if (!keystoreFile) {
      setLoginError("Please select your keystore file.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      return;
    }
    await loginWithKeystore(keystoreFile, loginPassword);
    // AuthContext handles navigation/state change
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKeystoreFile(e.target.files[0]);
      setLoginError(null); // Clear previous file errors
    } else {
      setKeystoreFile(null);
    }
  };

  const handleGuestMode = () => {
    clearLocalErrors();
    switchToGuestMode();
    // AuthContext handles navigation/state change
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="python-quest-theme">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 selection:bg-cyan-500 selection:text-white">
        <header className="text-center mb-8 animate-fadeIn">
          <div className="inline-block p-3 bg-gradient-to-r from-cyan-500 to-green-500 rounded-xl mb-4 shadow-lg">
            <KeyRound size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
            Welcome to Python Quest
          </h1>
          <p className="text-lg md:text-xl text-gray-300">Your Secure, Self-Custody Learning Journey.</p>
        </header>

        <main className="w-full max-w-md animate-slideUp">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/80 border border-gray-700/60 rounded-lg backdrop-blur-sm">
              <TabsTrigger value="login" className="data-[state=active]:bg-cyan-600/80 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors duration-200">
                <LogIn size={18} className="mr-2" /> Login
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-green-600/80 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors duration-200">
                <UserPlus size={18} className="mr-2" /> Create
              </TabsTrigger>
              <TabsTrigger value="guest" className="data-[state=active]:bg-purple-600/80 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors duration-200">
                <PlayCircle size={18} className="mr-2" /> Guest
              </TabsTrigger>
            </TabsList>

            {/* Login with Keystore Tab */}
            <TabsContent value="login">
              <Card className="bg-gray-800/70 border-cyan-500/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-400">Login with Keystore</CardTitle>
                  <CardDescription className="text-gray-400">
                    Access your account using your secure keystore file and password.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginWithKeystore}>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="keystoreFile" className="text-sm font-medium text-gray-300">Keystore File (.json)</label>
                      <Input
                        id="keystoreFile"
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="bg-gray-700 border-gray-600 text-white file:text-cyan-400 file:font-semibold file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-cyan-500/20 hover:file:bg-cyan-500/30 transition-colors duration-200"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="loginPassword" className="text-sm font-medium text-gray-300">Password</label>
                      <div className="relative">
                        <Input
                          id="loginPassword"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => {setLoginPassword(e.target.value); setLoginError(null); if (setAuthError) setAuthError(null);}}
                          placeholder="Enter your keystore password"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-200"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          aria-pressed={showLoginPassword}
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                          disabled={isLoading}
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {loginError && <p className="text-sm text-red-400 flex items-center pt-1"><AlertTriangle size={16} className="mr-1 flex-shrink-0" />{loginError}</p>}
                    {authError && activeTab === 'login' && <p className="text-sm text-red-400 flex items-center pt-1"><AlertTriangle size={16} className="mr-1 flex-shrink-0" />{authError}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      Unlock Keystore
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Create Account Tab */}
            <TabsContent value="create">
              <Card className="bg-gray-800/70 border-green-500/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400">Create New Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Secure your progress with a self-custody keystore. Choose a strong password.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleCreateAccount}>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="createPassword" className="text-sm font-medium text-gray-300">Password</label>
                       <div className="relative">
                        <Input
                          id="createPassword"
                          type={showCreatePassword ? "text" : "password"}
                          value={createPassword}
                          onChange={(e) => {setCreatePassword(e.target.value); setCreateError(null); if (setAuthError) setAuthError(null);}}
                          placeholder="Choose a strong password (min. 8 characters)"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-200"
                          onClick={() => setShowCreatePassword(!showCreatePassword)}
                          aria-pressed={showCreatePassword}
                          aria-label={showCreatePassword ? "Hide password" : "Show password"}
                          disabled={isLoading}
                        >
                          {showCreatePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {setConfirmPassword(e.target.value); setCreateError(null); if (setAuthError) setAuthError(null);}}
                          placeholder="Confirm your password"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-200"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-pressed={showConfirmPassword}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {createError && <p className="text-sm text-red-400 flex items-center pt-1"><AlertTriangle size={16} className="mr-1 flex-shrink-0" />{createError}</p>}
                     {authError && activeTab === 'create' && <p className="text-sm text-red-400 flex items-center pt-1"><AlertTriangle size={16} className="mr-1 flex-shrink-0" />{authError}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      Create Account & Download Keystore
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Try as Guest Tab */}
            <TabsContent value="guest">
              <Card className="bg-gray-800/70 border-purple-500/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-400">Try Python Quest</CardTitle>
                  <CardDescription className="text-gray-400">
                    Explore the platform as a guest. Your progress will be saved locally in this browser.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Click below to start learning immediately. If you enjoy Python Quest, you can create a secure, self-custody keystore account at any time from the main dashboard to save your progress permanently across devices.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleGuestMode} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                    Continue as Guest
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="text-center mt-12 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-center text-green-400 mb-2">
            <ShieldCheck size={20} className="mr-2" />
            <p className="font-semibold">Your Keys, Your Progress, Your Control.</p>
          </div>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Python Quest uses a self-custody keystore model. Your encrypted private key is generated and stored on your device, protected by your password. We never have access to your unencrypted keys or password.
            <a href="https://github.com/Juniorduc44/pathToPython/blob/factorAI/keyStore_logins_00.md" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1 font-medium">Learn more</a>.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default LoginPage;
