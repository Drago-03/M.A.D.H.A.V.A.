import { useState } from 'react';
import { Search, Loader2, AlertTriangle, TrendingUp, BarChart3, GavelIcon, GraduationCap, Code2, Stethoscope, HeadphonesIcon, PlaneIcon, HomeIcon } from 'lucide-react';
import type { Domain, QueryResponse } from '../types';

interface DomainConfig {
  title: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
  symbol: string;
  isPremium?: boolean;
  apiSource?: string;
}

interface QueryInterfaceProps {
  user: any; // TODO: Define proper user type
  setShowLoginPrompt: (show: boolean) => void;
  domain: Domain;
  domainConfig: DomainConfig;
}

export function QueryInterface({ user, setShowLoginPrompt, domain, domainConfig }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [showStats, setShowStats] = useState(true);

  const domainStats = {
    finance: [
      { name: 'Market Cap', value: '$2.3T', trend: 1.2, color: 'text-emerald-600' },
      { name: 'Trading Volume', value: '$125B', trend: 0.8, color: 'text-blue-600' },
      { name: 'Volatility Index', value: '18.5', trend: -0.3, color: 'text-purple-600' },
      { name: 'Global Markets', value: '+1.7%', trend: 2.5, color: 'text-indigo-600' }
    ],
    legal: [
      { name: 'Active Cases', value: '1.2K', trend: 0.5, color: 'text-blue-600' },
      { name: 'Recent Precedents', value: '85', trend: 1.2, color: 'text-indigo-600' },
      { name: 'Success Rate', value: '92%', trend: 0.3, color: 'text-emerald-600' },
      { name: 'Response Time', value: '2.5h', trend: -0.8, color: 'text-purple-600' }
    ],
    education: [
      { name: 'Active Students', value: '2.8K', trend: 2.1, color: 'text-blue-600' },
      { name: 'Course Success', value: '94%', trend: 0.5, color: 'text-emerald-600' },
      { name: 'Engagement', value: '8.9/10', trend: 1.5, color: 'text-indigo-600' },
      { name: 'Learning Rate', value: '+12%', trend: 2.2, color: 'text-purple-600' }
    ],
    code: [
      { name: 'Code Quality', value: '95%', trend: 0.8, color: 'text-emerald-600' },
      { name: 'Debug Time', value: '-35%', trend: -2.1, color: 'text-blue-600' },
      { name: 'Efficiency', value: '+28%', trend: 2.4, color: 'text-indigo-600' },
      { name: 'Solutions Found', value: '99%', trend: 0.5, color: 'text-purple-600' }
    ],
    medical: [
      { name: 'Accuracy', value: '99.2%', trend: 0.3, color: 'text-emerald-600' },
      { name: 'Response Time', value: '1.2s', trend: -1.5, color: 'text-blue-600' },
      { name: 'Cases Analyzed', value: '15K', trend: 2.8, color: 'text-indigo-600' },
      { name: 'Success Rate', value: '97%', trend: 0.9, color: 'text-purple-600' }
    ],
    customerSupport: [
      { name: 'Resolution Rate', value: '95%', trend: 1.7, color: 'text-emerald-600' },
      { name: 'Response Time', value: '30s', trend: -2.5, color: 'text-blue-600' },
      { name: 'CSAT Score', value: '4.8/5', trend: 0.4, color: 'text-indigo-600' },
      { name: 'Active Users', value: '12K', trend: 2.1, color: 'text-purple-600' }
    ],
    travel: [
      { name: 'Bookings', value: '+25%', trend: 2.3, color: 'text-emerald-600' },
      { name: 'Cost Savings', value: '18%', trend: 1.8, color: 'text-blue-600' },
      { name: 'User Rating', value: '4.9/5', trend: 0.6, color: 'text-indigo-600' },
      { name: 'Destinations', value: '2.5K', trend: 1.4, color: 'text-purple-600' }
    ],
    realEstate: [
      { name: 'Properties', value: '8.2K', trend: 1.9, color: 'text-emerald-600' },
      { name: 'Avg. ROI', value: '+15%', trend: 2.2, color: 'text-blue-600' },
      { name: 'Market Value', value: '$2.8B', trend: 0.7, color: 'text-indigo-600' },
      { name: 'Transactions', value: '+32%', trend: 2.5, color: 'text-purple-600' }
    ]
  };

  const placeholders = {
    finance: "Analyze market trends, get Bloomberg real-time data insights...",
    legal: "Search Court Listener API for laws, precedents, and amendments...",
    education: "Get personalized NLP-powered educational assistance...",
    code: "Debug, optimize, and get expert coding assistance...",
    medical: "Access DeepChem-powered medical analysis and insights...",
    customerSupport: "Integrate AI-powered customer support solutions...",
    travel: "Plan trips, find deals, and get travel recommendations...",
    realEstate: "Access real-time property insights and market analysis..."
  };

  const domainFeatures = {
    finance: {
      icon: <BarChart3 className="h-5 w-5" />,
      features: [
        'Real-time Bloomberg market data',
        'Technical analysis insights',
        'Portfolio optimization',
        'Risk assessment metrics'
      ]
    },
    legal: {
      icon: <GavelIcon className="h-5 w-5" />,
      features: [
        'CourtListener API integration',
        'Real-time law updates',
        'Case law analysis',
        'Compliance monitoring'
      ]
    },
    education: {
      icon: <GraduationCap className="h-5 w-5" />,
      features: [
        'NLP-powered learning',
        'Personalized curriculum',
        'Real-time feedback',
        'Progress tracking'
      ]
    },
    code: {
      icon: <Code2 className="h-5 w-5" />,
      features: [
        'Gemini code analysis',
        'Real-time debugging',
        'Performance optimization',
        'Security scanning'
      ]
    },
    medical: {
      icon: <Stethoscope className="h-5 w-5" />,
      features: [
        'DeepChem integration',
        'Medical research insights',
        'Drug interaction analysis',
        'Clinical decision support'
      ]
    },
    customerSupport: {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      features: [
        'AI-driven customer care',
        'Multi-channel support',
        'Sentiment analysis',
        'Automated routing'
      ]
    },
    travel: {
      icon: <PlaneIcon className="h-5 w-5" />,
      features: [
        'Gemini travel planning',
        'Real-time recommendations',
        'Itinerary optimization',
        'Local insights'
      ]
    },
    realEstate: {
      icon: <HomeIcon className="h-5 w-5" />,
      features: [
        'Gemini property analysis',
        'Market trend insights',
        'Investment analysis',
        'Location analytics'
      ]
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          domain,
          user_id: user.id,
          filters: {
            isPremium: domainConfig.isPremium,
            apiSource: domainConfig.apiSource
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-50">
      <div className={`bg-gradient-to-r ${domainConfig.color} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${domainConfig.textColor}`}>MADHAVA</h1>
              <div className="flex items-center space-x-2">
                {domainFeatures[domain].icon}
                <span className={`text-sm ${domainConfig.textColor} opacity-75`}>
                  {domainConfig.title}
                </span>
              </div>
            </div>
            {domainConfig.isPremium && (
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20 bg-white ${domainConfig.textColor}`}>
                  PREMIUM
                </span>
                <span className={`text-xs ${domainConfig.textColor}`}>
                  {domainConfig.apiSource}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {domainStats[domain].map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white rounded-lg shadow-sm p-4 border border-slate-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-slate-500">{stat.name}</p>
                      <p className={`text-lg font-semibold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`flex items-center ${
                      stat.trend > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <TrendingUp 
                        className={`h-4 w-4 ${
                          stat.trend < 0 ? 'rotate-180' : ''
                        }`}
                      />
                      <span className="text-xs ml-1">
                        {Math.abs(stat.trend)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domainFeatures[domain].features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4 border border-slate-200"
              >
                <p className="text-sm font-medium text-slate-900">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {loading ? (
                  <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholders[domain]}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${domainConfig.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                'Ask M.A.D.H.A.V.A.'
              )}
            </button>
          </form>

          {response && !error && (
            <div className="mt-6 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-lg font-medium text-slate-900 mb-2">Response:</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{response.answer}</p>
              </div>

              {response.metrics && (
                <div className={`bg-opacity-10 rounded-lg p-4 border ${domainConfig.color.split(' ')[0].replace('from-', 'border-')}`}>
                  <h3 className="text-lg font-medium mb-2">Metrics:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(response.metrics).map(([key, value]) => (
                      <div key={key} className="bg-white rounded-md p-3 shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500">{key}</p>
                        <p className="text-lg font-medium text-slate-700">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {response.context && response.context.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Sources:</h3>
                  <div className="space-y-2">
                    {response.context.map((context, index) => (
                      <div key={index} className="text-sm text-slate-600">
                        {context}
                        {response.sources?.[index] && (
                          <p className="text-xs text-slate-400 mt-1">
                            Source: {response.sources[index]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}