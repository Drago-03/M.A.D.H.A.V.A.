import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { KeyRound, User, Mail, Lock, Eye, EyeOff, ArrowRight, DollarSign, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const navigate = useNavigate();

  // For demo purposes - presets the test account credentials
  useEffect(() => {
    // This is just for testing - in a real app, you would never do this
    const testMode = new URLSearchParams(window.location.search).get('test');
    if (testMode === 'true') {
      setEmail('owner@gmail.com');
      setPassword('admin');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          }
        });
        if (error) throw error;
        setSuccess('Please check your email for the confirmation link to complete your registration!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw error;
      setPasswordResetSent(true);
      setSuccess('Password reset instructions have been sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4"
          >
            <DollarSign className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin 
              ? 'Sign in to access your financial insights' 
              : 'Join SafalMudra for free financial intelligence'}
          </p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md flex items-start"
          >
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </motion.div>
        )}

        {passwordResetSent ? (
          <div className="text-center my-6">
            <p className="text-gray-600 mb-4">
              Check your email for a password reset link. Return to 
              <button 
                onClick={() => setPasswordResetSent(false)} 
                className="text-blue-600 font-medium ml-1 hover:underline"
              >
                sign in
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 border"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 border"
                  placeholder="••••••••"
                  required
                  minLength={isLogin ? 1 : 6}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
            
            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create account'} 
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
        
        {!passwordResetSent && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
                className="ml-1 font-medium text-blue-600 hover:text-blue-800"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to SafalMudra's 
            <a href="#" className="text-blue-600 hover:underline ml-1">Terms of Service</a> and 
            <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
          </p>
        </div>

        {/* For demo purposes only - Quick test login */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <details className="text-center">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              For testing purposes only
            </summary>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('owner@gmail.com');
                  setPassword('admin');
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Use test account credentials
              </button>
            </div>
          </details>
        </div>
      </motion.div>
    </div>
  );
}