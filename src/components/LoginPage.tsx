import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronDown, ChevronUp, Mail, Lock, AlertCircle, Code } from "lucide-react";

export default function LoginPage() {
  // Auth context
  const { 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError, 
    signInWithGoogle, 
    signInWithEmail, 
    signInWithMagicLink, 
    signInWithMetaMask, 
    signUp, 
    clearError 
  } = useAuth();

  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [otherOptionsOpen, setOtherOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    await signInWithEmail(email, password);
    setIsSubmitting(false);
  };

  // Handle email/password signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!email || !password || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    await signUp(email, password);
    setIsSubmitting(false);
  };

  // Handle magic link login
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!magicLinkEmail) {
      setFormError("Email is required");
      return;
    }

    setIsSubmitting(true);
    await signInWithMagicLink(magicLinkEmail);
    setIsSubmitting(false);
  };

  // Continue as guest
  const handleContinueAsGuest = () => {
    navigate('/');
  };

  // Clear errors when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormError("");
    clearError();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Embark on Your Python Quest!
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in or register to begin your coding adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error display */}
          {(authError || formError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {formError || authError?.message || "An error occurred"}
              </AlertDescription>
            </Alert>
          )}

          {/* Primary auth methods */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white"
              onClick={() => signInWithGoogle()}
              disabled={authLoading || isSubmitting}
            >
              {authLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>
            
            <Button 
              className="w-full bg-[#3C3C3D] hover:bg-[#2F2F30] text-white"
              onClick={() => signInWithMetaMask()}
              disabled={authLoading || isSubmitting}
            >
              {authLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.04183 1L15.0487 10.809L12.7336 4.99099L2.04183 1Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M28.2041 23.5466L24.7182 28.8816L32.0946 30.9307L34.1946 23.6558L28.2041 23.5466Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0.805298 23.6558L2.90524 30.9307L10.2816 28.8816L6.79578 23.5466L0.805298 23.6558Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.90523 14.5149L7.8324 17.6507L15.1489 17.9782L14.9034 10.0424L9.90523 14.5149Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25.0947 14.5149L20.0138 9.95215L19.8229 17.9782L27.1394 17.6507L25.0947 14.5149Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2816 28.8815L14.7125 26.7232L10.9399 23.7049L10.2816 28.8815Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.2874 26.7232L24.7183 28.8815L24.06 23.7049L20.2874 26.7232Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              Connect with MetaMask
            </Button>

            {/* Register Button - Prominent with Python Quest styling */}
            <Button 
              onClick={handleEmailSignup}
              className="w-full bg-[#3DBBAC] hover:bg-[#2A9D90] text-[#101823] font-bold border-2 border-[#3DBBAC] shadow-md"
              disabled={authLoading || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Code className="mr-2 h-4 w-4" />
              )}
              Register for Python Quest
            </Button>

            {/* Continue as Guest Button */}
            <Button 
              variant="outline"
              onClick={handleContinueAsGuest}
              className="w-full border-[#2A3441] hover:bg-[#1E293B] text-[#A6B0C2] hover:text-[#3DBBAC]"
              disabled={authLoading}
            >
              Continue as Guest
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Other Options
              </span>
            </div>
          </div>

          {/* Other options (collapsible) */}
          <Collapsible
            open={otherOptionsOpen}
            onOpenChange={setOtherOptionsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex justify-between items-center"
              >
                <span>Other Sign In Options</span>
                {otherOptionsOpen ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="magic">Magic Link</TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login" className="mt-4">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Sign Up Tab */}
                <TabsContent value="signup" className="mt-4">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Magic Link Tab */}
                <TabsContent value="magic" className="mt-4">
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="magic-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="magic-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          value={magicLinkEmail}
                          onChange={(e) => setMagicLinkEmail(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Link...
                        </>
                      ) : (
                        "Send Magic Link"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
