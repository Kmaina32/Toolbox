
import React, { useState, useRef, useEffect } from 'react';
import { Category, UIMode } from '../types';
import { ToolDefinition } from '../tools/base';
import { gemini } from '../services/geminiService';
import FileUploader from './FileUploader';
import { ExifTable, MapWorkspace } from './Workspaces';
import { 
  Copy, Download, X, Play, 
  Settings, Layout, Check, ChevronDown, 
  Loader2, AlertCircle, FileCheck, Files,
  Zap, Terminal as TerminalIcon, Globe
} from 'lucide-react';

interface BatchItem {
  file: File;
  base64: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: string;
  error?: string;
}

interface ToolInterfaceProps {
  tool: ToolDefinition;
  onClose: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const WORKSPACE_COMPONENTS: Record<string, React.FC<any>> = {
  'MetadataWorkspace': ExifTable,
  'MapWorkspace': MapWorkspace
};

const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose, onProcessingChange }) => {
  const [input, setInput] = useState('');
  const [batchFiles, setBatchFiles] = useState<BatchItem[]>([]);
  const [output, setOutput] = useState('');
  const [outputLinks, setOutputLinks] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [params, setParams] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(`fp-params-${tool.id}`);
    if (saved) return JSON.parse(saved);
    const defaults: Record<string, any> = {};
    tool.parameters?.forEach(p => defaults[p.id] = p.default);
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem(`fp-params-${tool.id}`, JSON.stringify(params));
  }, [params, tool.id]);

  useEffect(() => {
    onProcessingChange?.(isLoading);
  }, [isLoading, onProcessingChange]);

  const IconComp = tool.icon;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setOutput('');
    setOutputLinks([]);
    setImageUrl('');
    setCopied(false);

    try {
      let finalPrompt = tool.promptTemplate;
      if (Object.keys(params).length > 0) {
        finalPrompt += `\n[Avionics Overrides: ${JSON.stringify(params)}]`;
      }
      finalPrompt += `\n\nFlight Instruction: ${input}`;
      
      if (tool.uiMode === 'bulk' && batchFiles.length > 0) {
        const updatedBatch = [...batchFiles];
        for (let i = 0; i < updatedBatch.length; i++) {
          updatedBatch[i].status = 'processing';
          setBatchFiles([...updatedBatch]);
          try {
            const result = await gemini.processWithFile(finalPrompt, updatedBatch[i].base64, updatedBatch[i].file.type, tool.systemInstruction);
            updatedBatch[i].status = 'done';
            updatedBatch[i].result = result;
          } catch (err) {
            updatedBatch[i].status = 'error';
          }
          setBatchFiles([...updatedBatch]);
        }
      } else if (tool.workspaceComponent === 'MapWorkspace') {
        const result = await gemini.processWithMaps(finalPrompt);
        setOutput(result.text);
        setOutputLinks(result.links);
      } else if (tool.uiMode === 'studio') {
        const url = await gemini.generateImage(input || tool.placeholder || "Aerial masterwork cinematic");
        setImageUrl(url);
      } else if (batchFiles.length > 0) {
        const first = batchFiles[0];
        const result = await gemini.processWithFile(finalPrompt, first.base64, first.file.type, tool.systemInstruction);
        setOutput(result);
      } else {
        const stream = gemini.streamText(finalPrompt, tool.systemInstruction);
        for await (const chunk of stream) {
          setOutput((prev) => prev + chunk);
        }
      }
    } catch (err) {
      setOutput('COMM_LINK_ERROR: Remote processing core unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderParameters = () => {
    if (!tool.parameters || tool.parameters.length === 0) return null;
    return (
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5 flex items-center gap-2">
          <Settings size={12} /> Flight Avionics
        </h4>
        <div className="grid grid-cols-1 gap-5">
          {tool.parameters.map(p => (
            <div key={p.id}>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{p.label}</label>
              {p.type === 'select' && (
                <div className="relative">
                  <select 
                    value={params[p.id]}
                    onChange={(e) => setParams(prev => ({...prev, [p.id]: e.target.value}))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm outline-none appearance-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white font-semibold"
                  >
                    {p.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkspaceContent = () => {
    if (isLoading && !output) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-8 text-center animate-in fade-in zoom-in-95">
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 rounded-full border-[5px] border-slate-100 dark:border-slate-900 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-[5px] border-slate-100 dark:border-slate-900 border-b-indigo-500 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={32} className="text-blue-600 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Vectoring Intelligence</p>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-3 animate-pulse">Syncing with Pilot Core...</p>
          </div>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700">
            <img src={imageUrl} alt="Pilot Output" className="max-w-full rounded-[2rem]" />
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            <Download size={18} /> Download Asset
          </button>
        </div>
      );
    }

    if (output) {
      const SpecializedComponent = tool.workspaceComponent ? WORKSPACE_COMPONENTS[tool.workspaceComponent] : null;
      if (SpecializedComponent) return <SpecializedComponent data={output} links={outputLinks} />;
      
      return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 whitespace-pre-wrap ${tool.uiMode === 'lab' ? 'font-mono text-sm leading-relaxed bg-slate-950 text-emerald-400 p-8 lg:p-12 rounded-[2rem] border-4 border-slate-800 shadow-2xl overflow-x-auto custom-scrollbar' : 'text-base lg:text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-300'}`}>
          {tool.uiMode === 'lab' && (
            <div className="flex items-center gap-3 mb-6 border-b border-emerald-900/50 pb-4 text-emerald-500/50">
              <TerminalIcon size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Analysis manifest / root@filepilot</span>
            </div>
          )}
          {output}
          {tool.uiMode === 'lab' && <div className="mt-8 h-4 w-2 bg-emerald-500 animate-pulse inline-block"></div>}
        </div>
      );
    }

    if (tool.uiMode === 'bulk') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {batchFiles.map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${item.status === 'done' ? 'bg-green-100 text-green-600' : item.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.status === 'processing' ? <Loader2 className="animate-spin" size={20} /> : item.status === 'done' ? <FileCheck size={20} /> : item.status === 'error' ? <AlertCircle size={20} /> : <Files size={20} />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-slate-800 dark:text-white truncate text-sm tracking-tight">{item.file.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 opacity-60">{item.status}</p>
                </div>
              </div>
              {item.status === 'done' && (
                <button className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all"><Download size={18} /></button>
              )}
            </div>
          ))}
          {batchFiles.length === 0 && (
             <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-10 select-none">
                <div className="p-10 rounded-[3rem] bg-slate-100 dark:bg-slate-800 mb-6">
                  <Files size={100} className="text-slate-400" strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em]">Queue Depleted</h3>
             </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center opacity-10 select-none py-32">
        <IconComp size={140} className="mb-8 text-slate-400" strokeWidth={0.5} />
        <h3 className="text-4xl font-black tracking-tighter uppercase opacity-50">Unit Standby</h3>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center lg:p-6 bg-slate-950/95 backdrop-blur-2xl transition-all">
      <div className="bg-white dark:bg-slate-900 w-full h-full lg:max-w-[1600px] lg:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/5 relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <IconComp size={18} />
             </div>
             <span className="font-black text-sm tracking-tighter uppercase">{tool.name}</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* SIDEBAR / INPUT */}
        <div className="w-full lg:w-[460px] border-r border-slate-200 dark:border-slate-800 p-8 lg:p-12 flex flex-col bg-slate-50 dark:bg-slate-950/40 overflow-y-auto custom-scrollbar shrink-0">
          <div className="hidden lg:flex items-center gap-5 mb-10">
            <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <IconComp size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">{tool.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ACTIVE_VECTOR_READY</span>
              </div>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed mb-10">
            {tool.description}
          </p>

          <div className="flex-1 space-y-10">
            {(tool.uiMode === 'processor' || tool.uiMode === 'bulk') && (
              <FileUploader 
                multiple={tool.uiMode === 'bulk'}
                onFilesSelect={(files) => setBatchFiles(files.map(f => ({ ...f, status: 'pending' })))}
                accept={tool.category === Category.AUDIO_VIDEO ? "audio/*,video/*" : "*"}
              />
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <TerminalIcon size={12} /> Command Overrides
                </label>
                <span className="text-[9px] font-bold text-blue-500/50 uppercase tracking-widest">Optional</span>
              </div>
              <textarea
                className="w-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] resize-none outline-none text-slate-800 dark:text-white text-base shadow-inner min-h-[160px] focus:ring-4 focus:ring-blue-500/5 transition-all"
                placeholder={tool.placeholder || "Specify custom extraction or processing logic..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {renderParameters()}
          </div>

          <div className="mt-10 lg:mt-auto">
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (!input.trim() && batchFiles.length === 0 && tool.uiMode !== 'studio')}
              className={`w-full py-6 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl ${
                isLoading 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={28} /> : <Zap size={24} fill="currentColor" />}
              <span>{isLoading ? 'INITIATING...' : 'EXECUTE MISSION'}</span>
            </button>
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden">
          <button onClick={onClose} className="hidden lg:flex absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all z-[80] group">
            <X size={28} className="group-hover:rotate-90 transition-transform" />
          </button>

          <div className="h-16 lg:h-28 border-b border-slate-100 dark:border-slate-900 px-8 lg:px-16 flex items-center justify-between shrink-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">
                <Layout size={18} /> Output Manifest
              </div>
            </div>
            
            {(output || imageUrl) && !isLoading && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <button 
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="h-12 px-6 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all flex items-center gap-3 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  <span className="hidden sm:inline">{copied ? 'Mission Copied' : 'Copy Output'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-8 lg:p-16 overflow-y-auto custom-scrollbar scroll-smooth">
            {renderWorkspaceContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolInterface;
