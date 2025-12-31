
import React from 'react';
import { ToolDefinition } from '../tools/base';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const Icon = tool.icon;
  
  return (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all text-left flex flex-col h-full active:scale-[0.98] overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="mb-6 h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
        <Icon size={28} />
      </div>
      
      <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {tool.name}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">
        {tool.description}
      </p>
      
      <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          {tool.toolType}
        </span>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <span className="text-[10px] font-black uppercase tracking-widest">Deploy Unit</span>
        </div>
      </div>
    </button>
  );
};

export default ToolCard;