
import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { TOOL_REGISTRY } from '../tools/registry';
import { ToolDefinition } from '../tools/base';
import { Box, Compass, X, Activity, History, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentToolIds: string[];
  setActiveTool: (tool: ToolDefinition) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  recentToolIds,
  setActiveTool,
  isOpen,
  setIsOpen
}) => {
  const recentTools = recentToolIds
    .map(id => TOOL_REGISTRY.find(item => item.id === id))
    .filter((t): t is ToolDefinition => !!t);

  const handleCategorySelect = (cat: Category | 'All') => {
    setSelectedCategory(cat);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`fixed lg:relative inset-y-0 left-0 w-[85%] max-w-[320px] lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[70] transition-all duration-300 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-6 lg:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Compass size={22} className="animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                File Pilot <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-80">Avionics System v3.1</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-transform"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 mb-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 rounded-2xl text-sm outline-none transition-all dark:text-white placeholder:text-slate-400/60 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-8 pb-8">
          {recentTools.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 ml-2">
                <History size={12} className="text-slate-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Recents</h3>
              </div>
              <div className="space-y-1">
                {recentTools.map(tool => {
                  const IconComp = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => { setActiveTool(tool); if(window.innerWidth < 1024) setIsOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm group"
                    >
                      <IconComp size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="truncate flex-1 font-semibold">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3 ml-2">
              <LayoutGrid size={12} className="text-slate-400" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Navigation</h3>
            </div>
            <nav className="space-y-1.5">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all ${
                  selectedCategory === 'All' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold scale-[1.02]' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Box size={18} />
                <span className="text-sm font-bold">The Hangar</span>
              </button>
              
              {CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold scale-[1.02]' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComp size={18} />
                    <span className="text-sm font-bold truncate">{cat.id}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative">
              <Activity size={16} className="text-green-500" />
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider">Engine: Gemini 3</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connection Stable</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
