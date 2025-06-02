import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { WalletExplorer } from './pages/wallet-explorer';
import { Header } from './components/header';
import { Footer } from './components/footer';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="moralis-wallet-theme">
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<WalletExplorer />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}
