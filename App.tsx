
import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from './constants';
import { Category } from './types';
import Sidebar from './components/Sidebar';
import ToolInterface from './components/ToolInterface';
import ToolCard from './components/ToolCard';
import { TOOL_REGISTRY } from './tools/registry';
import { ToolDefinition } from './tools/base';
import { gemini } from './services/geminiService';
import { 
  Box, ChevronRight, Sun, Moon, 
  Terminal, Menu, Cpu, Globe, Zap,
  Search, Grid
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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('fpai-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('fpai-recent-tools', JSON.stringify(recentToolIds));
  }, [recentToolIds]);

  const handleToolClick = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setRecentToolIds(prev => {
      const filtered = prev.filter(id => id !== tool.id);
      return [tool.id, ...filtered].slice(0, 5);
    });
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
              Operational Log
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
               <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all shadow-inner"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-black text-xs shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              FP
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950 scroll-smooth">
          <div className="max-w-7xl mx-auto p-6 lg:p-12">
            <div className="mb-8 lg:mb-16">
              <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-left duration-700">
                <div className="h-1 w-8 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                  {selectedCategory === 'All' ? 'Central Command' : 'Specialized Vector'}
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 lg:mb-8 tracking-tighter leading-tight animate-in slide-in-from-bottom duration-700">
                {selectedCategory === 'All' ? '200+ SaaS AI Ideas.' : selectedCategory}
              </h2>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-10 animate-in fade-in duration-1000 delay-200">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base lg:text-lg max-w-xl leading-relaxed">
                  The ultimate SaaS incubator. Explore <span className="text-blue-600 font-black">{filteredItems.length}</span> functional AI tools spanning 15+ industries.
                </p>
                <div className="flex gap-3">
                  <div className="px-5 py-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                    <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Latency</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{avionics.latency}</div>
                  </div>
                  <div className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                    <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Compute</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{avionics.compute}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {filteredItems.map((item, idx) => (
                <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 40}ms` }}>
                  <ToolCard
                    tool={item}
                    onClick={() => handleToolClick(item)}
                  />
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                  <div className="h-32 w-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center text-7xl shadow-inner mb-8 animate-float">
                    🎛️
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-300 uppercase tracking-tighter">No Units Responding</h3>
                  <p className="mt-2 text-base font-medium opacity-60 px-6 text-center max-w-md">Search criteria out of range. Recalibrate navigation filters.</p>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                    className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/30"
                  >
                    Reset Avionics
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <footer className="py-12 flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-900 opacity-30 select-none">
            <div className="flex items-center gap-8 grayscale mb-6">
               <Cpu size={24} />
               <Globe size={24} />
               <Zap size={24} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400">Security / Speed / Intelligence</p>
          </footer>
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
