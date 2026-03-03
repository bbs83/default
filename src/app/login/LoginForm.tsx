/* ============================================================
   Login Form — client component used by /login
   ============================================================
   Clean centered card with email/password login,
   Google OAuth, and a link to switch to sign up.
   ============================================================ */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Where to redirect after login (defaults to /dashboard)
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Handle email/password login */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Welcome back!');
    // Use window.location for a full page navigation to ensure cookies are properly set
    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <span className="text-gold font-bold text-3xl tracking-tight">Valtiq</span>
        </Link>

        {/* Auth card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-navy text-center mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            Log in to access your valuation reports.
          </p>

          {/* Email/Password form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 spinner" />}
              Log In
            </button>
          </form>

          {/* Switch to sign up */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-gold font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
