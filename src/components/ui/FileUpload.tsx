import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Spinner } from './Spinner';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error?: string;
  previewUrl?: string | null;
  label?: string;
  accept?: string;
  isValidating?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  error,
  previewUrl,
  label,
  accept = 'image/*',
  isValidating = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs sm:text-sm text-dark-200 mb-2.5 font-medium tracking-wide">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] bg-transparent hover:bg-orange-500/[0.02]
          ${isDragging ? 'border-orange-500 bg-orange-500/10' : error ? 'border-red-500' : 'border-orange-500/60 hover:border-orange-500'}
        `}
      >
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
        />

        {previewUrl ? (
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md shadow-black/50"
              />
              {isValidating && (
                <div className="absolute inset-0 bg-dark-900/70 rounded-full flex flex-col items-center justify-center w-20 h-20">
                  <Spinner size="sm" />
                  <span className="text-[9px] text-white mt-1 text-center font-medium leading-tight">Verificando...</span>
                </div>
              )}
            </div>
            <p className="text-xs text-orange-400 mt-2 font-medium">Hacé click para cambiar la foto</p>
          </div>
        ) : (
          <>
            <div className="w-11 h-11 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2">
              <Camera className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-dark-200 font-medium">
              Arrastrá tu foto aquí o hacé click para seleccionar
            </p>
            <p className="text-[11px] text-dark-400 mt-1">Formatos permitidos: JPG, PNG, WEBP (rostro claro)</p>
          </>
        )}
      </div>
      {error && <p className="mt-1.5 px-3 text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
};
