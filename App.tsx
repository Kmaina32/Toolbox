
import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from './constants';
import { Category } from './types';
import Sidebar from './components/Sidebar';
import ToolInterface from './components/ToolInterface';
import ToolCard from './components/ToolCard';
import AuthPage from './components/AuthPage';
import { TOOL_REGISTRY } from './tools/registry';
import { ToolDefinition } from './tools/base';
import { gemini } from './services/geminiService';
import { supabase } from './services/supabaseService';
import { 
  Box, ChevronRight, Sun, Moon, 
  Terminal, Menu, Cpu, Globe, Zap,
  LogOut, AlertCircle, Compass
} from 'lucide-react';

const useAvionicsStats = (isProcessing: boolean) => {
  const [stats, setStats] = useState({
    speed: '0.0 Mbps',
    latency: '0ms',
    compute: '80T'
  });

  useEffect(() => {
    const updateStats = async () => {
      const conn = (navigator as any).connection;
      let speedStr = '0.0 Mbps';
      if (conn && conn.downlink) {
        const jitter = (Math.random() * 0.4) - 0.2;
        speedStr = `${(conn.downlink + jitter).toFixed(1)} Mbps`;
      } else {
        speedStr = `${(12 + Math.random() * 5).toFixed(1)} Mbps`;
      }

      const lat = await gemini.measureLatency();
      const latStr = lat > 0 ? `${lat}ms` : `${Math.floor(20 + Math.random() * 15)}ms`;

      const baseCompute = isProcessing ? 120 : 80;
      const computeJitter = Math.floor(Math.random() * 10);
      const computeStr = `${baseCompute + computeJitter}T`;

      setStats({ speed: speedStr, latency: latStr, compute: computeStr });
    };

    updateStats();
    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, [isProcessing]);

  return stats;
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const avionics = useAvionicsStats(isProcessing);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('fpai-dark-mode');
    return saved ? JSON.parse(saved) : true;
  });

  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('fpai-recent-tools');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const initAuth = async () => {
      if (!supabase) {
        console.warn("Supabase not configured. Proceeding to Gateway.");
        setIsAuthChecking(false);
        return;
      }
      
      try {
        // Parallelize session check and state update
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.error("Auth Link Failure:", err);
      } finally {
        setIsAuthChecking(false);
      }
    };

    initAuth();

    // Listen for changes
    let subscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setSession(session);
      });
      subscription = data.subscription;
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('fpai-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleToolClick = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setRecentToolIds(prev => {
      const filtered = prev.filter(id => id !== tool.id);
      return [tool.id, ...filtered].slice(0, 5);
    });
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const filteredItems = useMemo(() => {
    return TOOL_REGISTRY.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedCatData = CATEGORIES.find(c => c.id === selectedCategory);

  if (isAuthChecking) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
           <div className="h-20 w-20 border-[3px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              {/* Added missing Compass icon */}
              <Compass size={32} className="text-blue-600 animate-pulse" />
           </div>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tighter mb-2">Establishing Uplink</h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] max-w-xs leading-loose">
          Syncing encrypted session keys with high-altitude satellite array...
        </p>
      </div>
    );
  }

  // If Supabase is totally missing, show a specific error rather than standard login
  if (!supabase) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tighter mb-4">Navigation System Offline</h2>
        <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed mb-8">
          The Supabase environment variables are missing. Deployment cannot vector without an active database link.
        </p>
        <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl text-left w-full max-w-md">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Required Telemetry Keys:</p>
           <ul className="space-y-1 text-xs font-mono text-slate-300">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div> SUPABASE_URL
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div> SUPABASE_ANON_KEY
              </li>
           </ul>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      <Sidebar 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentToolIds={recentToolIds}
        setActiveTool={handleToolClick}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 lg:h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl px-5 lg:px-8 flex items-center justify-between z-[50] shrink-0">
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl active:scale-90 transition-transform"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] border border-transparent dark:border-slate-700/50">
              <Terminal size={10} />
              Authenticated
            </div>
            
            <span className="hidden sm:block text-slate-300 dark:text-slate-700">
              <ChevronRight size={16} />
            </span>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${selectedCatData ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'} transition-all`}>
              {selectedCatData ? <selectedCatData.icon size={16} /> : <Box size={16} />}
              <span className="font-bold text-xs tracking-tight truncate max-w-[120px] lg:max-w-none">
                {selectedCategory}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden md:flex items-center gap-4 mr-2">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Speed</span>
                  <span className="text-[11px] font-bold text-green-500 animate-pulse">{avionics.speed}</span>
               </div>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all shadow-inner"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={handleSignOut}
              className="h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950 scroll-smooth">
          <div className="max-w-7xl mx-auto p-6 lg:p-12">
            <div className="mb-8 lg:mb-16">
              <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-left duration-700">
                <div className="h-1 w-8 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                  Welcome, Pilot {session.user.email?.split('@')[0]}
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 lg:mb-8 tracking-tighter leading-tight animate-in slide-in-from-bottom duration-700">
                Command Terminal
              </h2>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-10 animate-in fade-in duration-1000 delay-200">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base lg:text-lg max-w-xl leading-relaxed">
                  Your secure AI utility fleet is online. Choose a vector to begin specialized operations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {filteredItems.map((item, idx) => (
                <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 20}ms` }}>
                  <ToolCard
                    tool={item}
                    onClick={() => handleToolClick(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {activeTool && (
        <ToolInterface 
          tool={activeTool} 
          onClose={() => setActiveTool(null)} 
          onProcessingChange={setIsProcessing}
        />
      )}
    </div>
  );
};

export default App;
