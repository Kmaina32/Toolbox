
import React, { useState, useRef, useEffect } from 'react';
import { Category, UIMode } from '../types';
import { ToolDefinition } from '../tools/base';
import { gemini } from '../services/geminiService';
import FileUploader from './FileUploader';
import { 
  Copy, Download, X, Play, Wand2, FileSearch, 
  Settings, Code, Layout, MessageSquare, Image as ImageIcon,
  Check, ChevronDown, Loader2, AlertCircle, FileCheck, Files
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

const ToolInterface: React.FC<ToolInterfaceProps> = ({ tool, onClose }) => {
  const [input, setInput] = useState('');
  const [batchFiles, setBatchFiles] = useState<BatchItem[]>([]);
  const [output, setOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [params, setParams] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    tool.parameters?.forEach(p => defaults[p.id] = p.default);
    return defaults;
  });

  const outputRef = useRef<HTMLDivElement>(null);
  const IconComp = tool.icon;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setOutput('');
    setImageUrl('');
    setCopied(false);

    try {
      let finalPrompt = tool.promptTemplate;
      if (Object.keys(params).length > 0) {
        finalPrompt += `\n[Settings: ${JSON.stringify(params)}]`;
      }
      finalPrompt += `\n\nUser Input: ${input}`;
      
      if (tool.uiMode === 'bulk' && batchFiles.length > 0) {
        // Handle batch processing
        const updatedBatch = [...batchFiles];
        for (let i = 0; i < updatedBatch.length; i++) {
          updatedBatch[i].status = 'processing';
          setBatchFiles([...updatedBatch]);
          
          try {
            const result = await gemini.processWithFile(
              finalPrompt, 
              updatedBatch[i].base64, 
              updatedBatch[i].file.type, 
              tool.systemInstruction
            );
            updatedBatch[i].status = 'done';
            updatedBatch[i].result = result;
          } catch (err) {
            updatedBatch[i].status = 'error';
            updatedBatch[i].error = 'Failed to convert';
          }
          setBatchFiles([...updatedBatch]);
        }
      } else if (tool.uiMode === 'studio') {
        const url = await gemini.generateImage(input || tool.placeholder || "Professional visual asset");
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
      console.error(err);
      setOutput('Workflow failed. Check your input or file compatibility.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderParameters = () => {
    if (!tool.parameters || tool.parameters.length === 0) return null;
    return (
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Settings size={12} />
          Configuration
        </h4>
        <div className="space-y-4">
          {tool.parameters.map(p => (
            <div key={p.id}>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">{p.label}</label>
              {p.type === 'select' && (
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
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-10 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full h-full max-w-[1600px] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-[450px] border-r border-slate-200 dark:border-slate-800 p-8 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30">
                <IconComp size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{tool.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {tool.uiMode} Engine
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-red-500"><X size={24} /></button>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium leading-relaxed">
            {tool.description}
          </p>

          <div className="flex-1 flex flex-col gap-8">
            {(tool.uiMode === 'processor' || tool.uiMode === 'bulk') && (
              <div className="space-y-6">
                <FileUploader 
                  multiple={tool.uiMode === 'bulk'}
                  onFilesSelect={(files) => setBatchFiles(files.map(f => ({ ...f, status: 'pending' })))}
                  accept={tool.category === Category.AUDIO_VIDEO ? "audio/*,video/*" : ".pdf,.txt,.docx,.csv,.json"}
                />
                <textarea
                  className="w-full p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl resize-none focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 dark:text-white text-sm shadow-inner min-h-[140px]"
                  placeholder="Additional context or specific conversion rules (optional)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            )}

            {tool.uiMode === 'studio' && (
              <div className="space-y-6">
                <textarea
                  className="w-full p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl resize-none focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 dark:text-white text-lg font-medium shadow-inner min-h-[240px]"
                  placeholder="Describe your visual concept in detail..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            )}

            {(tool.uiMode === 'lab' || tool.uiMode === 'desk') && (
              <textarea
                className={`w-full p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl resize-none focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white shadow-inner min-h-[300px] ${tool.uiMode === 'lab' ? 'font-mono text-xs' : 'text-base font-medium'}`}
                placeholder={tool.placeholder || "Input your data or text here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            )}

            {renderParameters()}
          </div>

          <div className="mt-10">
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (!input.trim() && batchFiles.length === 0 && !tool.placeholder)}
              className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                isLoading 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1'
              }`}
            >
              {isLoading ? <Wand2 className="animate-spin" size={24} /> : <Play size={20} fill="currentColor" />}
              <span>{isLoading ? 'Processing' : (tool.uiMode === 'bulk' ? 'Start Batch' : 'Deploy Engine')}</span>
            </button>
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden">
          <button onClick={onClose} className="hidden md:flex absolute top-10 right-10 p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all z-20">
            <X size={28} />
          </button>

          <div className="h-24 border-b border-slate-100 dark:border-slate-900 px-12 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-600 font-black text-xs uppercase tracking-[0.2em]">
              {tool.uiMode === 'bulk' ? <Files size={16} /> : <Layout size={16} />}
              Manifest Output
            </div>
          </div>

          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
            {tool.uiMode === 'bulk' ? (
              <div className="space-y-4">
                {batchFiles.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        item.status === 'done' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                        item.status === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        {item.status === 'processing' ? <Loader2 className="animate-spin" size={20} /> : 
                         item.status === 'done' ? <FileCheck size={20} /> :
                         item.status === 'error' ? <AlertCircle size={20} /> : <Files size={20} />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-slate-800 dark:text-white truncate">{item.file.name}</p>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-1">{item.status}</p>
                      </div>
                    </div>
                    {item.status === 'done' && (
                      <button 
                        onClick={() => {
                          const blob = new Blob([item.result || ''], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `converted-${item.file.name}.txt`;
                          a.click();
                        }}
                        className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-110 transition-transform"
                      >
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                ))}
                {batchFiles.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale mt-20">
                      <Files size={120} className="mb-8 text-slate-400" strokeWidth={1} />
                      <h3 className="text-3xl font-black text-slate-400">Queue Empty</h3>
                   </div>
                )}
              </div>
            ) : (
              <>
                {isLoading && !output && (
                  <div className="h-full flex flex-col items-center justify-center gap-8">
                    <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                  </div>
                )}

                {!output && !imageUrl && !isLoading && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale">
                    <IconComp size={120} className="mb-8 text-slate-400" strokeWidth={1} />
                    <h3 className="text-3xl font-black text-slate-400">Engine Idle</h3>
                  </div>
                )}

                {imageUrl && (
                  <div className="flex flex-col items-center gap-8 animate-in zoom-in-95">
                    <img src={imageUrl} alt="AI Result" className="max-w-full rounded-[3rem] shadow-2xl border-8 border-slate-100 dark:border-slate-900" />
                  </div>
                )}

                {output && (
                  <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 whitespace-pre-wrap ${tool.uiMode === 'lab' ? 'font-mono text-sm bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800' : 'text-lg leading-relaxed text-slate-700 dark:text-slate-300'}`}>
                    {output}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolInterface;
