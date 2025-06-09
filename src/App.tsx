import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { WalletExplorer } from '@/pages/wallet-explorer';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, user, profile, signOut } = useAuth();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="path-to-python-theme">
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Header 
            isAuthenticated={isAuthenticated}
            username={profile?.username || user?.email?.split('@')[0] || "User"}
            onSignOut={signOut}
          />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <WalletExplorer />
                </ProtectedRoute>
              } />
              {/* Add more protected routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
