
import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { TOOL_REGISTRY } from '../tools/registry';
import { ToolDefinition } from '../tools/base';
import { Box } from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentToolIds: string[];
  setActiveTool: (tool: ToolDefinition) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  recentToolIds,
  setActiveTool
}) => {
  // Resolve tools from the registry instead of the missing SAAS_ITEMS constant
  const recentTools = recentToolIds
    .map(id => TOOL_REGISTRY.find(item => item.id === id))
    .filter((t): t is ToolDefinition => !!t);

  return (
    <div className="w-80 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-6 overflow-hidden transition-colors">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
          OmniSaaS
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Powering 200+ AI Workflows</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        {recentTools.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-2">Recent Tools</h3>
            <div className="space-y-1">
              {recentTools.map(tool => {
                const IconComp = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool)}
                    className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm group"
                  >
                    <IconComp size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate flex-1">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-2">Categories</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                selectedCategory === 'All' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Box size={20} className="flex-shrink-0" />
              <span className="text-sm">All Tools</span>
            </button>
            
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
                >
                  <IconComp size={20} className="flex-shrink-0" />
                  <span className="text-sm truncate">{cat.id}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Engine Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Gemini 3 Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
