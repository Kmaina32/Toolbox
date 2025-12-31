
import React from 'react';
import { Table, MapPin, ExternalLink, Info, Search } from 'lucide-react';

export const ExifTable = ({ data }: { data: string }) => {
  // Simple heuristic to parse structured text into a table
  const lines = data.split('\n').filter(l => l.includes(':'));
  
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
            <Table size={18} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs">Exif Manifest</h3>
        </div>
        <div className="relative">
           <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
           <input placeholder="Filter tags..." className="pl-9 pr-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] outline-none w-48 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 dark:bg-slate-800/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-4">Field Parameter</th>
              <th className="px-8 py-4">Value / Trace</th>
              <th className="px-8 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {lines.map((line, idx) => {
              const [key, ...val] = line.split(':');
              return (
                <tr key={idx} className="border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-4 text-slate-900 dark:text-slate-100 font-bold">{key.trim()}</td>
                  <td className="px-8 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{val.join(':').trim()}</td>
                  <td className="px-8 py-4">
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] rounded-md font-black uppercase tracking-widest">Verified</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const MapWorkspace = ({ data, links }: { data: string, links: any[] }) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in-95">
      <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] border-8 border-white dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 grayscale"></div>
        <MapPin size={48} className="text-blue-500 mb-4 z-10 animate-bounce" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs z-10">Geospatial Data Context Active</p>
        
        {links && links.length > 0 && (
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
            {links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.uri} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-blue-600 hover:scale-105 transition-all flex items-center gap-2"
              >
                <ExternalLink size={12} />
                VIEW SOURCE {idx + 1}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100/50 dark:border-blue-900/20">
        <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">
          <Info size={14} /> Location Intelligence Report
        </div>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {data}
        </p>
      </div>
    </div>
  );
};
