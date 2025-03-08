import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryInterface } from './components/QueryInterface';
import { LoginPage } from './components/LoginPage';
import { HistoryPage } from './components/HistoryPage';
import { LineChart, History, LogOut, ChevronRight, CreditCard, TrendingUp, DollarSign, AlertCircle, User } from 'lucide-react';
import { supabase } from './lib/supabase';
import { motion } from 'framer-motion';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 10 }}
                className="mr-3"
              >
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">SafalMudra</h1>
                <p className="text-xs text-blue-200">Financial Insights Made Simple</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="hidden md:flex items-center text-blue-100 hover:text-white"
              >
                <TrendingUp className="w-5 h-5 mr-1" />
                <span>Dashboard</span>
              </Link>
              
              {user && (
                <Link
                  to="/history"
                  className="hidden md:flex items-center text-blue-100 hover:text-white"
                >
                  <History className="w-5 h-5 mr-1" />
                  <span>History</span>
                </Link>
              )}
              
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-1 rounded-md bg-blue-700 hover:bg-blue-900 text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-3 py-1 rounded-md bg-blue-700 hover:bg-blue-900 text-white transition-colors"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {showLoginPrompt && !user && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md shadow-sm"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    Sign in to save your history and get unlimited access.
                    <Link to="/login" className="font-medium underline text-amber-700 hover:text-amber-600 ml-1">
                      Sign in now
                    </Link>
                  </p>
                </div>
                <button 
                  onClick={() => setShowLoginPrompt(false)} 
                  className="ml-auto text-amber-500 hover:text-amber-600"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
          
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/login" />} />
            <Route path="/" element={<QueryInterface setShowLoginPrompt={setShowLoginPrompt} user={user} />} />
          </Routes>
        </main>
        
        <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <DollarSign className="w-5 h-5 mr-1 text-yellow-400" />
                  SafalMudra
                </h3>
                <p className="text-sm text-blue-200">
                  Open-source financial insights platform powered by advanced AI
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Resources</h3>
                <ul className="text-sm space-y-1 text-blue-200">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API Reference</a></li>
                  <li><a href="#" className="hover:text-white">Community Forum</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-sm text-blue-200">
                  Built on open-source data and freely accessible to all users.
                  No cost, no hidden fees.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-blue-700">
              <p className="text-center text-sm text-blue-200">
                © {new Date().getFullYear()} SafalMudra - Free and Open Source Financial Intelligence
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;