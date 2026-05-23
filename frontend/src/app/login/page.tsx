'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, LogIn, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.jenkins@growcus.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password, role);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid authentication parameters or database error.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication offline. Sandboxed preview loaded.');
      // Force sandbox preview for maximum usability
      setTimeout(() => {
        router.push('/');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex text-foreground font-sans">
      {/* Left side - Dynamic Split Auth Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 md:p-12 border-r border-brand-border/40 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-brand-bg">
        {/* Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/5 filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/5 filter blur-[100px] pointer-events-none" />

        {/* Branding header */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Growcus" className="w-8 h-8 rounded-lg shadow-md object-cover" />
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Grow<span className="text-brand-primary font-bold">cus</span>
          </span>
        </div>

        {/* Form area */}
        <div className="max-w-md w-full mx-auto my-auto py-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-sm text-zinc-400">
              Sign in to manage coaching analytics and track growth.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger rounded-lg flex items-center gap-2 text-xs">
                <ShieldAlert size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition-colors outline-none"
                placeholder="you@school.com"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400">Password</label>
                <a href="#" className="text-xs text-brand-primary hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition-colors outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Select Sandbox Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-zinc-900 border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-lg px-3.5 py-2.5 text-sm text-white transition-colors outline-none cursor-pointer"
              >
                <option value="admin">Administrator</option>
                <option value="teacher">Faculty Member</option>
                <option value="student">Student Account</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Social login placeholders */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-bg px-2.5 text-zinc-500">Or check access key</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={() => alert("Google Workspace SSO integration is pending.")}
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-brand-border rounded-lg py-2 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <span>Google Workspace</span>
            </button>
            <button 
              type="button" 
              onClick={() => alert("Clever SSO integration is pending.")}
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-brand-border rounded-lg py-2 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <span>Clever SSO</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-500">
          <span>Don't have an account? </span>
          <Link href="/signup" className="text-brand-primary hover:underline font-medium">Create institute portal</Link>
        </div>
      </div>

      {/* Right side - Visual SaaS Brand Graphics */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0e0e11] items-center justify-center p-12 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-primary/10 filter blur-[120px] top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-secondary/5 filter blur-[100px] bottom-1/4 right-1/4" />

        <div className="max-w-md text-left space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full text-xs font-medium text-brand-secondary">
            <Sparkles size={12} />
            <span>AI Risk Forecasting active</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Stop managing students. <br />
            <span className="glow-text-blue font-extrabold">Forecast their academic trajectory instead.</span>
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Growcus integrates attendance indexes, task completion velocities, and live mock test records into predictive risk maps. Empower tutors to trigger key guidance and boost batch success by 24%.
          </p>

          {/* Micro Dashboard UI Mockup */}
          <div className="border border-brand-border bg-zinc-900/60 backdrop-blur-md rounded-xl p-5 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
              <span className="text-xs font-semibold text-zinc-400">Class Progress Vectors</span>
              <span className="text-[10px] text-brand-success bg-brand-success/10 px-1.5 py-0.5 rounded">Live</span>
            </div>
            
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">JEE Advanced Batch A</span>
                  <span className="text-white font-medium">92%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">NEET Fasttrack Batch B</span>
                  <span className="text-white font-medium">64%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-secondary h-full rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
