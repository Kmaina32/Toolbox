
import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from './constants';
import { Category } from './types';
import Sidebar from './components/Sidebar';
import ToolInterface from './components/ToolInterface';
import ToolCard from './components/ToolCard';
import { TOOL_REGISTRY } from './tools/registry';
import { ToolDefinition } from './tools/base';
import { 
  Box, ChevronRight, Sun, Moon, 
  Terminal, Menu, Cpu, Globe, Zap 
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        {/* Header - Fixed & Glassmorphic */}
        <header className="h-16 lg:h-24 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl px-5 lg:px-12 flex items-center justify-between z-[50] shrink-0">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform"
            >
              <Menu size={22} />
            </button>
            
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] border border-transparent dark:border-slate-700/50">
              <Terminal size={12} />
              Operational Log
            </div>
            
            <span className="hidden sm:block text-slate-300 dark:text-slate-700">
              <ChevronRight size={20} />
            </span>
            
            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl ${selectedCatData ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'} transition-all scale-100`}>
              {selectedCatData ? <selectedCatData.icon size={18} /> : <Box size={18} />}
              <span className="font-black text-xs lg:text-sm tracking-tighter truncate max-w-[120px] lg:max-w-none">
                {selectedCategory}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden md:flex items-center gap-4 mr-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Speed</span>
                  <span className="text-xs font-bold text-green-500">1.2 GB/s</span>
               </div>
               <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-inner"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-10 w-10 lg:h-14 lg:w-14 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-black text-sm lg:text-xl shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              FP
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950 scroll-smooth">
          <div className="max-w-7xl mx-auto p-6 lg:p-20">
            <div className="mb-12 lg:mb-24">
              <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left duration-700">
                <div className="h-1.5 w-10 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-600">
                  {selectedCategory === 'All' ? 'Central Command' : 'Specialized Vector'}
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 lg:mb-10 tracking-tighter leading-[0.9] animate-in slide-in-from-bottom duration-700">
                {selectedCategory === 'All' ? 'Next-Gen File Intelligence.' : selectedCategory}
              </h2>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-12 animate-in fade-in duration-1000 delay-200">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg lg:text-2xl max-w-2xl leading-relaxed">
                  Ready for mission. Deploy <span className="text-blue-600 font-black">{filteredItems.length}</span> autonomous AI units for data forensics and transformation.
                </p>
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Latency</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">24ms</div>
                  </div>
                  <div className="px-6 py-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Compute</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">120T</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredItems.map((item, idx) => (
                <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                  <ToolCard
                    tool={item}
                    onClick={() => handleToolClick(item)}
                  />
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                  <div className="h-40 w-40 rounded-[3.5rem] bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center text-8xl shadow-inner mb-10 animate-float">
                    🎛️
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 dark:text-slate-300 uppercase tracking-tighter">No Units Responding</h3>
                  <p className="mt-4 text-xl font-medium opacity-60 px-6 text-center max-w-md">Search criteria out of range. Recalibrate navigation or reset hangar filters.</p>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                    className="mt-12 px-12 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/40"
                  >
                    Reset Avionics
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Decoration */}
          <footer className="py-20 flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-900 opacity-30 select-none">
            <div className="flex items-center gap-10 grayscale mb-8">
               <Cpu size={32} />
               <Globe size={32} />
               <Zap size={32} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400">Security / Speed / Intelligence</p>
          </footer>
        </div>
      </main>

      {/* Workspace Modal */}
      {activeTool && (
        <ToolInterface 
          tool={activeTool} 
          onClose={() => setActiveTool(null)} 
        />
      )}
    </div>
  );
};

export default App;
