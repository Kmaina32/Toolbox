
import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from './constants';
import { Category } from './types';
import Sidebar from './components/Sidebar';
import ToolInterface from './components/ToolInterface';
import ToolCard from './components/ToolCard';
import { TOOL_REGISTRY } from './tools/registry';
import { ToolDefinition } from './tools/base';
import { Box, ChevronRight, Sun, Moon, Home, Search, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('omni-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('omni-recent-tools');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('omni-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('omni-recent-tools', JSON.stringify(recentToolIds));
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
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors selection:bg-blue-100 dark:selection:bg-blue-900">
      <Sidebar 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentToolIds={recentToolIds}
        setActiveTool={(tool) => handleToolClick(tool as unknown as ToolDefinition)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest shadow-inner">
              <Home size={12} />
              Platform
            </div>
            <span className="text-slate-300 dark:text-slate-700">
              <ChevronRight size={18} />
            </span>
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl ${selectedCatData ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} shadow-sm border border-black/5 dark:border-white/5`}>
              {selectedCatData ? <selectedCatData.icon size={20} /> : <LayoutGrid size={20} />}
              <span className="font-bold tracking-tight">{selectedCategory}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Command + K to search..."
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm outline-none transition-all dark:text-white focus:ring-2 focus:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
              title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
              Gemini Flash
            </div>
            <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-inner">
              OS
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto p-10">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1.5 w-8 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                  {selectedCategory === 'All' ? 'Catalog' : 'Focus Area'}
                </span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                {selectedCategory === 'All' ? 'Unified intelligence workspace.' : selectedCategory}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                Ready to deploy <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredItems.length}</span> optimized AI units for your current context.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <ToolCard
                  key={item.id}
                  tool={item}
                  onClick={() => handleToolClick(item)}
                />
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-6">
                  <div className="h-28 w-28 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-6xl shadow-inner transition-transform hover:scale-105">
                    🔎
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-300">No tools detected</h3>
                    <p className="mt-2 text-lg font-medium opacity-60">Adjust your search parameters or explore other dimensions.</p>
                    <button 
                      onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                      className="mt-8 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Workspace Modal */}
      {activeTool && (
        <ToolInterface 
          tool={activeTool as any} 
          onClose={() => setActiveTool(null)} 
        />
      )}
    </div>
  );
};

export default App;
