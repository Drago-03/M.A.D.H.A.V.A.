import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Clock, Search, Trash2, Calendar, ChevronDown, 
  AlertTriangle, DollarSign, Scale, Newspaper, ShoppingBag,
  Stethoscope, AlertCircle, CheckCircle, Tag, BarChart
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Domain, QueryResponse } from '../types';

interface QueryHistory extends Omit<QueryResponse, 'domain_specific_data'> {
  id: string;
  created_at: string;
  query: string;
  user_id: string;
  domain: Domain;
  domain_specific_data?: Record<string, any>;
}

interface HistoryPageProps {
  domain: Domain;
}

export function HistoryPage({ domain }: HistoryPageProps) {
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [loading, setLoading] = useState(false);

  // Domain UI configurations
  const domainConfigs = {
    finance: {
      icon: <DollarSign className="w-5 h-5" />, 
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'from-blue-50 to-white',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      title: 'Financial Insights',
      symbol: '₹'
    },
    healthcare: {
      icon: <Stethoscope className="w-5 h-5" />, 
      color: 'bg-emerald-100 text-emerald-600',
      bgColor: 'from-emerald-50 to-white',
      borderColor: 'border-emerald-400',
      textColor: 'text-emerald-700',
      title: 'Medical Research',
      symbol: '+'
    },
    legal: {
      icon: <Scale className="w-5 h-5" />, 
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'from-purple-50 to-white',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-700',
      title: 'Legal Compliance',
      symbol: '§'
    },
    news: {
      icon: <Newspaper className="w-5 h-5" />, 
      color: 'bg-cyan-100 text-cyan-600',
      bgColor: 'from-cyan-50 to-white',
      borderColor: 'border-cyan-400',
      textColor: 'text-cyan-700',
      title: 'News Analysis',
      symbol: '📰'
    },
    ecommerce: {
      icon: <ShoppingBag className="w-5 h-5" />, 
      color: 'bg-teal-100 text-teal-600',
      bgColor: 'from-teal-50 to-white',
      borderColor: 'border-teal-400',
      textColor: 'text-teal-700',
      title: 'Product Recommendations',
      symbol: '🛍️'
    },
    all: {
      icon: <History className="w-5 h-5" />, 
      color: 'bg-gray-100 text-gray-600',
      bgColor: 'from-gray-50 to-white',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-700',
      title: 'All Insights',
      symbol: '🔍'
    }
  };
  
  useEffect(() => {
    if (domain !== selectedDomain) {
      setSelectedDomain(domain);
    }
    fetchHistory();
  }, [domain]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
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
    (selectedDomain === 'all' || item.domain === selectedDomain) &&
    (item.query?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.answer?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current domain config
  const currentConfig = domainConfigs[selectedDomain];

  const renderDomainSpecificData = (item: QueryHistory) => {
    if (!item.domain_specific_data) return null;
    
    const data = item.domain_specific_data;
    
    if (item.domain === 'finance' && data.metrics) {
      return (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 text-gray-700 flex items-center">
            <BarChart className="w-4 h-4 mr-1.5 text-blue-500" />
            Financial Metrics:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(data.metrics).map(([key, value]) => (
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
      );
    }
    
    if (item.domain === 'healthcare' && data.clinical_findings) {
      return (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 text-gray-700 flex items-center">
            <Stethoscope className="w-4 h-4 mr-1.5 text-green-500" />
            Clinical Findings:
          </h4>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-gray-700">{data.clinical_findings.summary}</p>
            <p className="text-xs text-gray-500 mt-1">Source: {data.clinical_findings.source}</p>
          </div>
        </div>
      );
    }
    
    if (item.domain === 'legal' && data.regulatory_update) {
      return (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 text-gray-700 flex items-center">
            <Scale className="w-4 h-4 mr-1.5 text-purple-500" />
            Regulatory Update:
          </h4>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="text-sm text-gray-700">{data.regulatory_update.summary}</p>
            <p className="text-xs text-gray-500 mt-1">Source: {data.regulatory_update.source}</p>
          </div>
        </div>
      );
    }
    
    if (item.domain === 'news' && data.fact_check) {
      // Get color based on rating
      let ratingColor = 'text-gray-600';
      let bgColor = 'bg-gray-50';
      let icon = <AlertCircle className="w-4 h-4 mr-1.5 text-gray-500" />;
      
      if (data.fact_check.rating === 1) {
        ratingColor = 'text-red-600';
        bgColor = 'bg-red-50';
        icon = <AlertTriangle className="w-4 h-4 mr-1.5 text-red-500" />;
      } else if (data.fact_check.rating === 2) {
        ratingColor = 'text-orange-600';
        bgColor = 'bg-orange-50';
        icon = <AlertTriangle className="w-4 h-4 mr-1.5 text-orange-500" />;
      } else if (data.fact_check.rating === 3) {
        ratingColor = 'text-yellow-600';
        bgColor = 'bg-yellow-50';
        icon = <AlertCircle className="w-4 h-4 mr-1.5 text-yellow-500" />;
      } else if (data.fact_check.rating === 4) {
        ratingColor = 'text-green-600';
        bgColor = 'bg-green-50';
        icon = <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />;
      } else if (data.fact_check.rating === 5) {
        ratingColor = 'text-green-700';
        bgColor = 'bg-green-50';
        icon = <CheckCircle className="w-4 h-4 mr-1.5 text-green-600" />;
      }
      
      const ratingText = ['False', 'Mostly False', 'Mixed', 'Mostly True', 'True'][data.fact_check.rating - 1];
      
      return (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 text-gray-700 flex items-center">
            <Newspaper className="w-4 h-4 mr-1.5 text-red-500" />
            Fact Check Result:
          </h4>
          <div className={`${bgColor} p-3 rounded-md`}>
            <div className="flex items-center">
              {icon}
              <span className={`font-medium ${ratingColor}`}>
                {ratingText} ({data.fact_check.rating}/5)
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{data.fact_check.explanation}</p>
          </div>
        </div>
      );
    }
    
    if (item.domain === 'ecommerce' && data.recommendations) {
      return (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 text-gray-700 flex items-center">
            <ShoppingBag className="w-4 h-4 mr-1.5 text-orange-500" />
            Product Recommendations:
          </h4>
          <div className="space-y-3">
            {data.recommendations.slice(0, 2).map((product: any, i: number) => (
              <div key={i} className="bg-orange-50 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-medium text-gray-800">{product.name}</h5>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded">
                    {product.price_range}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {product.features.slice(0, 2).map((feature: string, j: number) => (
                    <div key={j} className="flex items-start mt-1">
                      <Tag className="w-3 h-3 mr-1 mt-0.5 text-orange-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {data.recommendations.length > 2 && (
              <p className="text-xs text-gray-500 italic">
                +{data.recommendations.length - 2} more recommendations
              </p>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading your insights history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white py-8 px-4 mb-8 rounded-lg shadow-xl"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            M.A.D.H.A.V.A.
          </motion.h1>
          <p className="text-lg text-blue-200 mb-2">
            Multi-domain Analytical Data Harvesting & Automated Verification Assistant
          </p>
          <motion.div 
            className="text-6xl mt-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {domainConfigs[selectedDomain].symbol}
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`p-2 ${currentConfig.color} rounded-full mr-3`}>
              {currentConfig.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your {currentConfig.title} History</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as Domain | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              title="Filter history items"
            >
              <option value="all">All Domains</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="legal">Legal</option>
              <option value="news">News</option>
              <option value="ecommerce">E-commerce</option>
            </select>
            
            <div className="relative w-full">
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
        </div>
        
        <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.borderColor} p-4 rounded-md mb-6`}>
          <p className={`text-sm ${currentConfig.textColor}`}>
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
                : selectedDomain !== 'all' 
                  ? `You haven't made any ${selectedDomain} queries yet.`
                  : "You haven't made any queries yet. Start by asking a question!"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((item, index) => {
              // Get domain-specific config for this item
              const itemConfig = domainConfigs[item.domain || 'all'];
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`mr-2 p-1 rounded-full ${itemConfig.color}`}>
                          {itemConfig.icon}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete history item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">{item.query}</h3>
                      {item.answer && (
                        <p className="text-gray-600 line-clamp-2">
                          {item.answer.substring(0, 120)}
                          {item.answer.length > 120 ? "..." : ""}
                        </p>
                      )}
                    </div>
                    
                    {item.answer && (
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                        className={`flex items-center text-sm font-medium ${
                          item.domain === 'finance' ? 'text-blue-600 hover:text-blue-800' :
                          item.domain === 'healthcare' ? 'text-green-600 hover:text-green-800' :
                          item.domain === 'legal' ? 'text-purple-600 hover:text-purple-800' :
                          item.domain === 'news' ? 'text-red-600 hover:text-red-800' :
                          'text-orange-600 hover:text-orange-800'
                        }`}
                      >
                        {expandedItem === item.id ? "Show less" : "Show more"}
                        <ChevronDown 
                          className={`ml-1 w-4 h-4 transition-transform ${expandedItem === item.id ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                    )}
                    
                    <AnimatePresence>
                      {expandedItem === item.id && item.answer && (
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
                          
                          {/* Domain specific data */}
                          {renderDomainSpecificData(item)}
                          
                          {item.metrics && !item.domain_specific_data && (
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
                          
                          {item.context && item.context.length > 0 && (
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
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}