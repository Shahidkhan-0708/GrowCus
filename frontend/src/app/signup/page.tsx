'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, UserPlus, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [institute, setInstitute] = useState('Apex Academy');
  const [email, setEmail] = useState('admin@apex.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await signup(institute + ' Admin', email, password, 'admin', institute);
      if (success) {
        router.push('/');
      } else {
        setError('Signup failed. Sandbox preview loaded.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration offline. Launching sandboxed session.');
      setTimeout(() => {
        router.push('/');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex text-foreground font-sans">
      {/* Left side - Visual SaaS Brand Graphics */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#0e0e11] items-center justify-center p-12 relative overflow-hidden border-r border-brand-border/40">
        {/* Glow Spheres */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-primary/10 filter blur-[120px] top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-secondary/5 filter blur-[100px] bottom-1/4 right-1/4" />

        <div className="max-w-md text-left space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full text-xs font-medium text-brand-primary">
            <Sparkles size={12} />
            <span>AI Risk Forecasting active</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Bootstrap your academy's <br />
            <span className="glow-text-purple font-extrabold">academic nervous system.</span>
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Empower your faculty with the same intelligence systems used by enterprise coaching hubs. Track attendance declines, generate task completion velocities, and coach with Aria.
          </p>
        </div>
      </div>

      {/* Right side - Dynamic Split Auth Form */}
      <div className="w-full lg:w-[50%] flex flex-col justify-between p-8 md:p-12 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-brand-bg">
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
            <h2 className="text-2xl font-bold tracking-tight text-white">Create your portal</h2>
            <p className="text-sm text-zinc-400">
              Initialize a sandbox to test student risk analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger rounded-lg flex items-center gap-2 text-xs">
                <ShieldCheck size={14} className="text-rose-500 animate-pulse" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Institute Name</label>
              <input
                type="text"
                required
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                className="w-full bg-zinc-900 border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition-colors outline-none"
                placeholder="Apex Academy"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition-colors outline-none"
                placeholder="admin@apex.edu"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition-colors outline-none"
                placeholder="••••••"
              />
            </div>

            <div className="flex items-center gap-2 mt-4 text-zinc-400 text-xs">
              <input type="checkbox" defaultChecked className="rounded border-zinc-700 text-brand-primary" />
              <span>I agree to terms of sandbox data terms.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-secondary hover:bg-brand-secondary/95 text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-md shadow-brand-secondary/20 flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Bootstrap Institute Portal</span>
                </>
              )}
            </button>
          </form>

          {/* SSO Options */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-bg px-2.5 text-zinc-500">SSO Integrations</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-brand-border rounded-lg py-2 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer transition-colors">
              <span>Google Workspace</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-brand-border rounded-lg py-2 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer transition-colors">
              <span>Clever SSO</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-500">
          <span>Already have an active workspace? </span>
          <Link href="/login" className="text-brand-primary hover:underline font-medium">Log in</Link>
        </div>
      </div>
    </div>
  );
}
