
import React, { useState, useRef, useEffect } from 'react';
import { Category, UIMode } from '../types';
import { ToolDefinition } from '../tools/base';
import { gemini } from '../services/geminiService';
import FileUploader from './FileUploader';
import { ExifTable, MapWorkspace } from './Workspaces';
import { 
  Copy, Download, X, Play, Wand2, FileSearch, 
  Settings, Code, Layout, MessageSquare, Image as ImageIcon,
  Check, ChevronDown, Loader2, AlertCircle, FileCheck, Files,
  Map as MapIcon, Table, Info, Globe
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
}

// Phase 1: Registry-based routing
const WORKSPACE_COMPONENTS: Record<string, React.FC<any>> = {
  'MetadataWorkspace': ExifTable,
  'MapWorkspace': MapWorkspace
};

const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose }) => {
  const [input, setInput] = useState('');
  const [batchFiles, setBatchFiles] = useState<BatchItem[]>([]);
  const [output, setOutput] = useState('');
  const [outputLinks, setOutputLinks] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Phase 1: State Persistence for parameters
  const [params, setParams] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(`tool-params-${tool.id}`);
    if (saved) return JSON.parse(saved);
    const defaults: Record<string, any> = {};
    tool.parameters?.forEach(p => defaults[p.id] = p.default);
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem(`tool-params-${tool.id}`, JSON.stringify(params));
  }, [params, tool.id]);

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
        finalPrompt += `\n[Settings: ${JSON.stringify(params)}]`;
      }
      finalPrompt += `\n\nUser Context: ${input}`;
      
      // Batch Logic (Phase 2 Enhancement)
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
            updatedBatch[i].error = 'Process failed';
          }
          setBatchFiles([...updatedBatch]);
        }
      } 
      // GPS/Maps Tooling (Phase 2)
      else if (tool.workspaceComponent === 'MapWorkspace') {
        const result = await gemini.processWithMaps(finalPrompt);
        setOutput(result.text);
        setOutputLinks(result.links);
      }
      // Image Generation
      else if (tool.uiMode === 'studio') {
        const url = await gemini.generateImage(input || tool.placeholder || "Professional visual asset");
        setImageUrl(url);
      } 
      // Single File Processor
      else if (batchFiles.length > 0) {
        const first = batchFiles[0];
        const result = await gemini.processWithFile(finalPrompt, first.base64, first.file.type, tool.systemInstruction);
        setOutput(result);
      } 
      // General Stream
      else {
        const stream = gemini.streamText(finalPrompt, tool.systemInstruction);
        for await (const chunk of stream) {
          setOutput((prev) => prev + chunk);
        }
      }
    } catch (err) {
      console.error(err);
      setOutput('System error: Critical workflow failure. Check connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderParameters = () => {
    if (!tool.parameters || tool.parameters.length === 0) return null;
    return (
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Settings size={12} /> Deploy Configuration
        </h4>
        <div className="space-y-4">
          {tool.parameters.map(p => (
            <div key={p.id}>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">{p.label}</label>
              {p.type === 'select' ? (
                <div className="relative">
                  <select 
                    value={params[p.id]}
                    onChange={(e) => setParams(prev => ({...prev, [p.id]: e.target.value}))}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500"
                  >
                    {p.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              ) : p.type === 'coordinate-picker' ? (
                 <div className="flex gap-2">
                   <input className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs" placeholder="Lat" />
                   <input className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs" placeholder="Lng" />
                 </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkspaceContent = () => {
    if (isLoading && !output) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-8">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full border-[6px] border-slate-100 dark:border-slate-800 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-[6px] border-slate-100 dark:border-slate-800 border-b-indigo-500 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Wand2 size={32} className="text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center animate-in fade-in slide-in-from-bottom-2">
            <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Deploying {tool.name}</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">Assembling metadata traces...</p>
          </div>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95">
          <img src={imageUrl} alt="AI Result" className="max-w-full rounded-[3rem] shadow-2xl border-8 border-slate-100 dark:border-slate-900" />
        </div>
      );
    }

    if (output) {
      const SpecializedComponent = tool.workspaceComponent ? WORKSPACE_COMPONENTS[tool.workspaceComponent] : null;
      if (SpecializedComponent) {
        return <SpecializedComponent data={output} links={outputLinks} />;
      }
      
      return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 whitespace-pre-wrap ${tool.uiMode === 'lab' ? 'font-mono text-sm bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner' : 'text-lg leading-relaxed text-slate-700 dark:text-slate-300'}`}>
          {output}
        </div>
      );
    }

    if (tool.uiMode === 'bulk') {
      return (
        <div className="space-y-4">
          {batchFiles.map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-center gap-4 flex-1">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm ${item.status === 'done' ? 'bg-green-100 text-green-600' : item.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.status === 'processing' ? <Loader2 className="animate-spin" size={24} /> : item.status === 'done' ? <FileCheck size={24} /> : item.status === 'error' ? <AlertCircle size={24} /> : <Files size={24} />}
                </div>
                <div className="flex-1 overflow-hidden ml-2">
                  <p className="font-bold text-slate-800 dark:text-white truncate text-lg tracking-tight">{item.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'done' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{item.status}</p>
                  </div>
                </div>
              </div>
              {item.status === 'done' && (
                <button onClick={() => {}} className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-blue-600 shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all"><Download size={20} /></button>
              )}
            </div>
          ))}
          {batchFiles.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale mt-20">
                <div className="p-10 rounded-[3rem] bg-slate-100 dark:bg-slate-800/50 mb-8">
                  <Files size={100} className="text-slate-400" strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-black text-slate-400">Batch Queue Empty</h3>
                <p className="text-slate-500 mt-2 font-medium">Upload multiple files to start bulk analysis.</p>
             </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center opacity-30 dark:opacity-10 grayscale select-none">
        <IconComp size={160} className="mb-8 text-slate-400" strokeWidth={0.5} />
        <h3 className="text-4xl font-black text-slate-400 tracking-tighter uppercase">Inspection Idle</h3>
        <p className="text-slate-500 mt-4 text-xl font-bold">Input parameters to deploy logic unit.</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-10 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 w-full h-full max-w-[1700px] rounded-none md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:row border border-white/10 relative">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-[480px] border-r border-slate-200 dark:border-slate-800 p-10 flex flex-col bg-slate-50/80 dark:bg-slate-950/50 overflow-y-auto custom-scrollbar shrink-0">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30">
                <IconComp size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{tool.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse shadow-[0_0_10px_orange]' : 'bg-green-500 shadow-[0_0_10px_green]'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Engine Status: {isLoading ? 'Busy' : 'Available'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden p-3 text-slate-400 hover:text-red-500 transition-all"><X size={32} /></button>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 font-medium leading-relaxed tracking-tight">
            {tool.description}
          </p>

          <div className="flex-1 flex flex-col gap-10">
            {(tool.uiMode === 'processor' || tool.uiMode === 'bulk') && (
              <div className="space-y-8">
                <FileUploader 
                  multiple={tool.uiMode === 'bulk'}
                  onFilesSelect={(files) => setBatchFiles(files.map(f => ({ ...f, status: 'pending' })))}
                  accept={tool.category === Category.AUDIO_VIDEO ? "audio/*,video/*" : ".pdf,.txt,.docx,.csv,.json,.jpg,.png,.jpeg"}
                />
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-10 transition-opacity"></div>
                  <textarea
                    className="relative w-full p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] resize-none outline-none text-slate-800 dark:text-white text-base shadow-inner min-h-[160px] transition-all focus:border-blue-500"
                    placeholder="Provide specific transformation rules..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </div>
            )}

            {tool.uiMode === 'studio' && (
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-10"></div>
                <textarea
                  className="relative w-full p-10 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] resize-none outline-none text-slate-800 dark:text-white text-xl font-bold shadow-2xl min-h-[300px] transition-all focus:border-blue-500"
                  placeholder="Describe your creative vision..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            )}

            {(tool.uiMode === 'lab' || tool.uiMode === 'desk') && (
              <textarea
                className={`w-full p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] resize-none outline-none dark:text-white shadow-inner min-h-[350px] ${tool.uiMode === 'lab' ? 'font-mono text-xs' : 'text-lg font-medium'}`}
                placeholder={tool.placeholder || "Enter data payload..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            )}

            {renderParameters()}
          </div>

          <div className="mt-12">
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (batchFiles.length === 0 && !input.trim() && !tool.placeholder && tool.uiMode !== 'studio')}
              className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl ${
                isLoading 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={28} /> : <Zap size={24} fill="currentColor" />}
              <span>{isLoading ? 'Processing Pipeline' : (tool.uiMode === 'bulk' ? 'Initialize Batch' : 'Deploy Logic')}</span>
            </button>
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden">
          <button onClick={onClose} className="hidden md:flex absolute top-12 right-12 p-4 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all z-30 group">
            <X size={32} className="group-hover:rotate-90 transition-transform" />
          </button>

          <div className="h-28 border-b border-slate-100 dark:border-slate-900 px-16 flex items-center justify-between shrink-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-600 font-black text-[10px] uppercase tracking-[0.4em]">
                {tool.uiMode === 'bulk' ? <Files size={18} /> : <Layout size={18} />}
                Unified Workspace / {tool.category}
              </div>
            </div>
            
            {(output || imageUrl) && !isLoading && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                <button 
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="h-12 px-8 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all flex items-center gap-3 border border-slate-200 dark:border-slate-800"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied' : 'Copy Result'}
                </button>
                <button className="h-12 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  <Download size={18} /> Export Data
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
            {renderWorkspaceContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolInterface;

const Zap = ({ size, fill, className }: { size: number, fill?: string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);
