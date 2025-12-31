
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
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <Settings size={10} /> Avionics
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {tool.parameters.map(p => (
            <div key={p.id}>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{p.label}</label>
              {p.type === 'select' && (
                <div className="relative">
                  <select 
                    value={params[p.id]}
                    onChange={(e) => setParams(prev => ({...prev, [p.id]: e.target.value}))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none appearance-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white font-semibold"
                  >
                    {p.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={14} />
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
        <div className="h-full flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in-95">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-[4px] border-slate-100 dark:border-slate-900 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={24} className="text-blue-600 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Vectoring Intelligence</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 animate-pulse">Syncing with Pilot Core...</p>
          </div>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700">
            <img src={imageUrl} alt="Pilot Output" className="max-w-full rounded-[1.75rem] max-h-[70vh] object-contain" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            <Download size={14} /> Download Asset
          </button>
        </div>
      );
    }

    if (output) {
      const SpecializedComponent = tool.workspaceComponent ? WORKSPACE_COMPONENTS[tool.workspaceComponent] : null;
      if (SpecializedComponent) return <SpecializedComponent data={output} links={outputLinks} />;
      
      return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 whitespace-pre-wrap ${tool.uiMode === 'lab' ? 'font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 p-6 lg:p-8 rounded-2xl border-2 border-slate-800 shadow-2xl overflow-x-auto custom-scrollbar' : 'text-sm lg:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300'}`}>
          {tool.uiMode === 'lab' && (
            <div className="flex items-center gap-2 mb-4 border-b border-emerald-900/50 pb-3 text-emerald-500/50">
              <TerminalIcon size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Analysis manifest</span>
            </div>
          )}
          {output}
          {tool.uiMode === 'lab' && <div className="ml-1 h-3 w-1.5 bg-emerald-500 animate-pulse inline-block align-middle"></div>}
        </div>
      );
    }

    if (tool.uiMode === 'bulk') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {batchFiles.map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${item.status === 'done' ? 'bg-green-100 text-green-600' : item.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.status === 'processing' ? <Loader2 className="animate-spin" size={16} /> : item.status === 'done' ? <FileCheck size={16} /> : item.status === 'error' ? <AlertCircle size={16} /> : <Files size={16} />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-800 dark:text-white truncate text-xs tracking-tight">{item.file.name}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5 opacity-60">{item.status}</p>
                </div>
              </div>
              {item.status === 'done' && (
                <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-105 transition-all"><Download size={14} /></button>
              )}
            </div>
          ))}
          {batchFiles.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-10 select-none">
                <Files size={64} className="text-slate-400 mb-4" strokeWidth={1} />
                <h3 className="text-lg font-black uppercase tracking-[0.2em]">Queue Standby</h3>
             </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center opacity-10 select-none py-20">
        <IconComp size={100} className="mb-6 text-slate-400" strokeWidth={0.5} />
        <h3 className="text-2xl font-black tracking-tighter uppercase opacity-50">Operational Standby</h3>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center lg:p-6 bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="bg-white dark:bg-slate-900 w-full h-full lg:max-w-[1400px] lg:max-h-[850px] lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/5 relative">
        
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
             <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <IconComp size={16} />
             </div>
             <span className="font-bold text-xs tracking-tight uppercase">{tool.name}</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="w-full lg:w-[360px] border-r border-slate-200 dark:border-slate-800 p-6 lg:p-8 flex flex-col bg-slate-50 dark:bg-slate-950/40 overflow-y-auto custom-scrollbar shrink-0">
          <div className="hidden lg:flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl">
              <IconComp size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-tight">{tool.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">ACTIVE_LINK</span>
              </div>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
            {tool.description}
          </p>

          <div className="flex-1 space-y-8">
            {(tool.uiMode === 'processor' || tool.uiMode === 'bulk') && (
              <FileUploader 
                multiple={tool.uiMode === 'bulk'}
                onFilesSelect={(files) => setBatchFiles(files.map(f => ({ ...f, status: 'pending' })))}
                accept={tool.category === Category.AUDIO_VIDEO ? "audio/*,video/*" : "*"}
              />
            )}

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <TerminalIcon size={10} /> Instruction
                </label>
              </div>
              <textarea
                className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none text-slate-800 dark:text-white text-sm shadow-inner min-h-[140px] focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder={tool.placeholder || "Enter specific parameters..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {renderParameters()}
          </div>

          <div className="mt-8 lg:mt-auto">
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (!input.trim() && batchFiles.length === 0 && tool.uiMode !== 'studio')}
              className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg ${
                isLoading 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={16} fill="currentColor" />}
              <span>{isLoading ? 'INITIATING...' : 'EXECUTE MISSION'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden">
          <button onClick={onClose} className="hidden lg:flex absolute top-6 right-6 p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all z-[80] group">
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>

          <div className="h-14 lg:h-16 border-b border-slate-100 dark:border-slate-900 px-6 lg:px-10 flex items-center justify-between shrink-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5 text-slate-400 font-black text-[9px] uppercase tracking-[0.3em]">
                <Layout size={14} /> Output Manifest
              </div>
            </div>
            
            {(output || imageUrl) && !isLoading && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <button 
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="h-10 px-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  <span className="hidden sm:inline">{copied ? 'Mission Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar scroll-smooth">
            {renderWorkspaceContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolInterface;
