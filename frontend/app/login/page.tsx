'use client';

import { useState } from 'react';
import Link from 'next/link';
import api, { mockApi, isMockMode, DEMO_CREDENTIALS } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isMockMode) {
        response = await mockApi.login(formData.email, formData.password);
      } else {
        response = await api.post('/auth/login', formData);
      }
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center glow">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <span className="text-white font-semibold text-2xl">Primetrade<span className="text-purple-400">.ai</span></span>
        </Link>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h1>
          <p className="text-white/60 text-center mb-8">Sign in to continue to your dashboard</p>
          
          {/* Demo Credentials Box */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-purple-300">Demo Credentials</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-white/70">Email: <code className="bg-white/10 px-2 py-0.5 rounded text-purple-300">{DEMO_CREDENTIALS.email}</code></p>
              <p className="text-white/70">Password: <code className="bg-white/10 px-2 py-0.5 rounded text-purple-300">{DEMO_CREDENTIALS.password}</code></p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-3 w-full text-sm bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all"
            >
              ✨ Use Demo Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-dark"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-white/60">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          © 2026 Primetrade.ai - AI & Blockchain Venture Studio
        </p>
      </div>
    </div>
  );
}
