import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertTriangle, BarChart, TrendingUp, DollarSign, ChevronRight, Lock } from 'lucide-react';
import type { QueryRequest, QueryResponse } from '../types';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  type: string;
  message: string;
  data: Record<string, any>;
  timestamp: string;
}

interface QueryInterfaceProps {
  user: any;
  setShowLoginPrompt: (show: boolean) => void;
}

export function QueryInterface({ user, setShowLoginPrompt }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [showFinancialStats, setShowFinancialStats] = useState(true);

  // Example financial stats for the dashboard
  const financialStats = [
    { name: 'S&P 500', value: '+1.2%', trend: 'up' },
    { name: 'NASDAQ', value: '+0.8%', trend: 'up' },
    { name: 'DOW', value: '-0.3%', trend: 'down' },
    { name: 'Bitcoin', value: '+2.5%', trend: 'up' }
  ];
  
  useEffect(() => {
    // Connect to WebSocket for real-time alerts
    try {
      const websocket = new WebSocket('ws://localhost:8765');
      
      websocket.onmessage = (event) => {
        const alert = JSON.parse(event.data);
        setAlerts(prev => [alert, ...prev].slice(0, 5)); // Keep last 5 alerts
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setWs(websocket);
      
      // Fetch existing alerts
      fetch('http://localhost:8000/alerts')
        .then(res => res.json())
        .then(data => setAlerts(data.slice(0, 5)))
        .catch(console.error);
      
      return () => {
        websocket.close();
      };
    } catch (err) {
      console.error('WebSocket connection failed:', err);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Check if non-authenticated user has reached limit
    if (!user && messageCount >= 5) {
      setError('You have reached the 5 message limit. Please sign in to continue.');
      setShowLoginPrompt(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const request: QueryRequest = { query };
      const res = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get response from server');
      }
      
      const data: QueryResponse = await res.json();
      setResponse(data);
      
      // Increment message count for non-authenticated users
      if (!user) {
        setMessageCount(prevCount => {
          const newCount = prevCount + 1;
          if (newCount === 4) {
            setShowLoginPrompt(true);
          }
          return newCount;
        });
      }
      
      // Save query to history if user is authenticated
      if (user) {
        try {
          await supabase.from('query_history').insert({
            user_id: user.id,
            query: query,
            answer: data.answer,
            context: data.context,
            sources: data.sources,
            timestamp: data.timestamp,
          });
        } catch (err) {
          console.error('Error saving to history:', err);
        }
      }
    } catch (err) {
      console.error('Error querying API:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your query');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {!user && messageCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 md:p-10 mb-10 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Financial Intelligence at Your Fingertips</h1>
              <p className="text-blue-100 text-lg mb-6">
                Access real-time financial insights and analysis powered by AI. 
                Free and open source.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.scrollTo({
                    top: document.getElementById('query-section')?.offsetTop,
                    behavior: 'smooth'
                  })}
                  className="bg-white text-blue-600 px-5 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center"
                >
                  Try Now <ChevronRight className="ml-1 w-4 h-4" />
                </button>
                {!user && (
                  <a href="/login" className="bg-transparent border border-white text-white px-5 py-2 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
                    Sign Up Free
                  </a>
                )}
              </div>
            </div>
            <div className="w-full md:w-auto flex-shrink-0">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  yoyo: Infinity,
                  repeatDelay: 5
                }}
              >
                <DollarSign className="w-32 h-32 text-yellow-300 mx-auto" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {showFinancialStats && (
        <div className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {financialStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
              >
                <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xl font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.value}
                  </span>
                  <TrendingUp 
                    className={`ml-2 w-4 h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} ${stat.trend === 'down' && 'transform rotate-180'}`} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Recent Market Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-md p-4 shadow-sm"
              >
                <p className="text-sm text-yellow-800 font-medium">{alert.message}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div id="query-section" className="mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Ask About Finance</h2>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about financial regulations, market trends, or company analysis..."
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {!user && (
              <div className="mt-3 text-xs flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <Lock className="w-3 h-3 mr-1" />
                  <span>
                    {messageCount} of 5 free queries used
                    {messageCount >= 3 && (
                      <span className="ml-1 text-blue-600">
                        • <a href="/login" className="underline hover:text-blue-800">Sign in</a> for unlimited access
                      </span>
                    )}
                  </span>
                </div>
                {messageCount > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setShowFinancialStats(false)} 
                    className="text-blue-600 hover:underline"
                  >
                    Clear stats
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border-l-4 border-red-500"
        >
          {error}
          {!user && messageCount >= 5 && (
            <div className="mt-2 text-sm">
              <a href="/login" className="font-medium underline">
                Sign in now
              </a> to continue your analysis
            </div>
          )}
        </motion.div>
      )}
      
      <AnimatePresence>
        {response && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Answer</h3>
              <div className="prose prose-blue max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{response.answer}</p>
              </div>
            </motion.div>
            
            {response.metrics && (
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
                  <BarChart className="w-5 h-5 mr-2 text-blue-500" />
                  Financial Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(response.metrics).map(([key, value], i) => (
                    <motion.div 
                      key={key} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-gradient-to-br from-blue-50 to-slate-50 p-4 rounded-md shadow-sm border border-blue-100"
                    >
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace('_', ' ')}
                      </p>
                      <p className="text-lg font-semibold text-blue-700">
                        {typeof value === 'number' 
                          ? value >= 1_000_000 
                            ? `$${(value / 1_000_000).toFixed(2)}M`
                            : `$${value.toFixed(2)}`
                          : value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Supporting Context</h3>
              <div className="space-y-4">
                {response.context.map((context, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-md border border-gray-200"
                  >
                    <p className="text-sm text-gray-700">{context}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Source: {response.sources[i]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}