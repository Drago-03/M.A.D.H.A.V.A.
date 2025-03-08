import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History, Clock, Search, Trash2, Filter, Calendar, ChevronDown } from 'lucide-react';
import type { QueryResponse } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QueryHistory extends QueryResponse {
  id: string;
  created_at: string;
  query: string;
  user_id: string;
}

export function HistoryPage() {
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteHistoryItem = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('query_history')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state after successful deletion
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const filteredHistory = history.filter(item => 
    item.query.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading your financial insights history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3">
              <History className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Financial Insights History</h2>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
          <p className="text-sm text-blue-700">
            Your search history is private and only visible to you. All queries are encrypted and stored securely.
          </p>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {filteredHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-lg shadow-md"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No history found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No results matching "${searchTerm}". Try another search term.` 
                : "You haven't made any queries yet. Start by asking a financial question!"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      disabled={isDeleting}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{item.query}</h3>
                    <p className="text-gray-600 line-clamp-2">
                      {item.answer.substring(0, 120)}
                      {item.answer.length > 120 ? "..." : ""}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {expandedItem === item.id ? "Show less" : "Show more"}
                    <ChevronDown 
                      className={`ml-1 w-4 h-4 transition-transform ${expandedItem === item.id ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t mt-4 pt-4">
                          <h4 className="font-medium mb-2 text-gray-700">Complete Answer:</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                        </div>
                        
                        {item.metrics && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2 text-gray-700">Financial Metrics:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {Object.entries(item.metrics).map(([key, value]) => (
                                <div key={key} className="bg-blue-50 p-3 rounded-md">
                                  <p className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                                  <p className="text-sm font-semibold text-blue-700">
                                    {typeof value === 'number' 
                                      ? value >= 1_000_000 
                                        ? `$${(value / 1_000_000).toFixed(2)}M`
                                        : `$${value.toFixed(2)}`
                                      : value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 space-y-3">
                          <h4 className="font-medium text-gray-700">Sources:</h4>
                          {item.context.map((context, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                              <p className="text-sm text-gray-600">{context}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Source: {item.sources[i]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}