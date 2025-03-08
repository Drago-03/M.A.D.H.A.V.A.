import { DomainConfigs } from '../types';
import { 
  BarChart3, 
  GavelIcon, 
  GraduationCap, 
  Code2, 
  Stethoscope,
  HeadphonesIcon,
  PlaneIcon,
  HomeIcon 
} from 'lucide-react';

export const domainConfigs: DomainConfigs = {
  finance: {
    title: 'Financial Analytics',
    description: 'Real-time market analysis powered by Bloomberg Terminal API',
    color: 'from-emerald-600 to-emerald-700',
    textColor: 'text-emerald-50',
    icon: BarChart3,
    symbol: '📊',
    apiSource: 'Bloomberg Terminal API',
    isPremium: true,
    features: [
      'Real-time market data streaming',
      'Advanced technical analysis',
      'Portfolio optimization',
      'Risk assessment metrics'
    ]
  },
  legal: {
    title: 'Legal Assistant',
    description: 'Powered by CourtListener REST API',
    color: 'from-blue-600 to-blue-700',
    textColor: 'text-blue-50',
    icon: GavelIcon,
    symbol: '⚖️',
    apiSource: 'CourtListener API v4',
    isPremium: true,
    features: [
      'Real-time case law updates',
      'Legal document analysis',
      'Compliance monitoring',
      'Precedent tracking'
    ]
  },
  education: {
    title: 'AI Educator',
    description: 'Advanced NLP-powered learning assistant',
    color: 'from-indigo-600 to-indigo-700',
    textColor: 'text-indigo-50',
    icon: GraduationCap,
    symbol: '🎓',
    apiSource: 'Custom NLP Engine',
    isPremium: true,
    features: [
      'Personalized learning paths',
      'Real-time feedback',
      'Progress tracking',
      'Interactive exercises'
    ]
  },
  code: {
    title: 'Code Assistant',
    description: 'Powered by Google Gemini',
    color: 'from-purple-600 to-purple-700',
    textColor: 'text-purple-50',
    icon: Code2,
    symbol: '💻',
    apiSource: 'Gemini API',
    isPremium: true,
    features: [
      'Advanced code analysis',
      'Real-time debugging',
      'Performance optimization',
      'Security scanning'
    ]
  },
  medical: {
    title: 'Medical Assistant',
    description: 'Powered by DeepChem AI',
    color: 'from-rose-600 to-rose-700',
    textColor: 'text-rose-50',
    icon: Stethoscope,
    symbol: '🏥',
    apiSource: 'DeepChem API',
    isPremium: true,
    features: [
      'Clinical decision support',
      'Drug interaction analysis',
      'Medical imaging analysis',
      'Patient data analytics'
    ]
  },
  customerSupport: {
    title: 'AI Support',
    description: 'Enterprise customer support automation',
    color: 'from-amber-600 to-amber-700',
    textColor: 'text-amber-50',
    icon: HeadphonesIcon,
    symbol: '🎧',
    apiSource: 'Custom Support API',
    isPremium: true,
    features: [
      'Multi-channel support',
      'Sentiment analysis',
      'Automated ticket routing',
      'Performance analytics'
    ]
  },
  travel: {
    title: 'Travel Assistant',
    description: 'AI-powered travel planning',
    color: 'from-sky-600 to-sky-700',
    textColor: 'text-sky-50',
    icon: PlaneIcon,
    symbol: '✈️',
    apiSource: 'Travel API Suite',
    isPremium: true,
    features: [
      'Personalized itineraries',
      'Real-time pricing',
      'Risk assessment',
      'Local insights'
    ]
  },
  realEstate: {
    title: 'Real Estate AI',
    description: 'Intelligent property analysis',
    color: 'from-teal-600 to-teal-700',
    textColor: 'text-teal-50',
    icon: HomeIcon,
    symbol: '🏠',
    apiSource: 'Real Estate API Suite',
    isPremium: true,
    features: [
      'Market analysis',
      'Property valuation',
      'Investment insights',
      'Trend forecasting'
    ]
  }
};