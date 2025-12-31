
import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, Files } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelect: (files: { file: File, base64: string }[]) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelect, accept = "*", multiple = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const fileList = Array.from(files);
    setSelectedFiles(fileList);
    
    const processedFiles = await Promise.all(fileList.map(file => {
      return new Promise<{ file: File, base64: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ file, base64: e.target?.result as string });
        };
        reader.readAsDataURL(file);
      });
    }));
    
    onFilesSelect(processedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    onFilesSelect([]);
  };

  return (
    <div 
      className={`relative group h-48 w-full rounded-[1.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer ${
        dragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {selectedFiles.length > 0 ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in">
          <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
            {selectedFiles.length === 1 ? <CheckCircle size={24} /> : <Files size={24} />}
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
            {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} files selected`}
          </p>
          <p className="text-xs text-slate-400">
            {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB total
          </p>
          <button 
            onClick={(e) => { e.stopPropagation(); clearFiles(); }}
            className="mt-3 p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 flex items-center justify-center mb-3 transition-colors">
            <Upload size={24} />
          </div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {multiple ? 'Click or drag files to batch upload' : 'Click or drag file to upload'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Multi-format support for bulk conversion</p>
        </>
      )}
    </div>
  );
};

export default FileUploader;
