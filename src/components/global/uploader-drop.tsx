'use client';
import { useState, useEffect } from 'react';
import { DropzoneOptions } from 'react-dropzone';

import {
  FileUploader,
  FileInput,
} from './uploader-card';

interface FileUploadDropzoneProps {
  maxFiles: number;
  multiple: boolean;
  maxSize: number;
  accept: Record<string, string[]>;
  onFilesChange: (_files: File[] | null) => void;
  initialFiles?: File[];
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ maxFiles, multiple, maxSize, accept, onFilesChange, initialFiles }) => {
  const [files, setFiles] = useState<File[] | null>(initialFiles || []);

  const dropzone: DropzoneOptions = {
    accept,
    multiple,
    maxFiles,
    maxSize,
  };

  const handleFilesChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  useEffect(() => {
    if (initialFiles) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  return (
    <FileUploader
      maxSize={maxSize}
      value={files}
      onValueChange={handleFilesChange}
      dropzoneOptions={dropzone}
    >
      <FileInput className='flex items-center text-center justify-center'>
        <div className="flex items-center text-center justify-center h-48 w-48 rounded-full whitespace-pre-wrap leading-none tracking-tight lg:text-lg bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 text-neutral-950 border border-neutral-200 dark:border-neutral-700 border-neutral-200 shadow-md">
          <p className="text-neutral-400 text-sm font-medium">Arraste ou clique para adicionar</p>
        </div>
      </FileInput>
    </FileUploader>
  );
};

export default FileUploadDropzone;