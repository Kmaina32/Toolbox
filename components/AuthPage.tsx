
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { 
  Compass, 
  Mail, 
  Lock, 
  Github, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsLoading(true);
    setError(null);

    try {
      const { error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (!isLogin) alert('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[440px] z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-6 group">
            <Compass size={32} className="group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            File Pilot <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">Vectoring Intelligent SaaS Solutions</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/5 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl">
          <div className="flex bg-slate-950/50 p-1 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Command Log
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Enlist
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Fleet Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl shadow-white/5"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} />}
              {isLogin ? 'Initiate Session' : 'Create Account'}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/5"></div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Or Link With</span>
            <div className="h-[1px] flex-1 bg-white/5"></div>
          </div>

          <button 
            onClick={handleGoogleAuth}
            className="w-full bg-slate-950 border border-white/5 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
            </svg>
            Google Cloud
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-100">
           <ShieldCheck size={20} className="text-slate-400" />
           <div className="h-4 w-[1px] bg-white/10"></div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Session Link Active</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
