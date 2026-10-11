'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Film, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile } from '@/lib/supabase';

interface FileUploaderProps {
    /** Folder path in storage (e.g. 'propiedades', 'servicios') */
    folder: string;
    /** Callback when a file is successfully uploaded, receives the public URL */
    onUpload: (url: string) => void;
    /** Accept only images, only videos, or both */
    accept?: 'images' | 'videos' | 'all';
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Label text */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Compact mode (smaller height) */
    compact?: boolean;
    /** Dark theme mode */
    dark?: boolean;
}

interface UploadingFile {
    file: File;
    status: 'uploading' | 'done' | 'error';
    url?: string;
    preview?: string;
    errorMsg?: string;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB


const ACCEPT_MAP = {
    images: 'image/jpeg,image/png,image/webp,image/gif',
    videos: 'video/mp4,video/webm,video/quicktime',
    all: 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime',
};

export default function FileUploader({
    folder,
    onUpload,
    accept = 'all',
    multiple = true,
    label,
    helperText,
    compact = false,
    dark = false,
}: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isImage = (file: File) => file.type.startsWith('image/');
    const isVideo = (file: File) => file.type.startsWith('video/');

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files);

        // Strict MIME type allowlist — prevent extension spoofing
        const acceptedTypes = ACCEPT_MAP[accept].split(',');

        const validFiles: File[] = [];
        const rejectedEntries: UploadingFile[] = [];

        for (const f of fileArray) {
            if (!acceptedTypes.includes(f.type)) {
                rejectedEntries.push({
                    file: f,
                    status: 'error',
                    errorMsg: 'Tipo de archivo no permitido',
                });
            } else if (f.size > MAX_FILE_SIZE_BYTES) {
                rejectedEntries.push({
                    file: f,
                    status: 'error',
                    errorMsg: `Archivo demasiado grande (máx. 50 MB)`,
                });
            } else {
                validFiles.push(f);
            }
        }

        // Show rejected files immediately
        if (rejectedEntries.length > 0) {
            setUploadingFiles(prev => [...prev, ...rejectedEntries]);
            setTimeout(() => {
                setUploadingFiles(prev => prev.filter(e => e.status === 'uploading'));
            }, 4000);
        }

        if (validFiles.length === 0) return;

        // Create upload entries with previews
        const newEntries: UploadingFile[] = validFiles.map(file => {
            const entry: UploadingFile = { file, status: 'uploading' };
            if (isImage(file)) {
                entry.preview = URL.createObjectURL(file);
            }
            return entry;
        });

        setUploadingFiles(prev => [...prev, ...newEntries]);

        // Upload each file
        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            try {
                const url = await uploadFile(file, folder);
                if (url) {
                    setUploadingFiles(prev =>
                        prev.map(entry =>
                            entry.file === file
                                ? { ...entry, status: 'done', url }
                                : entry
                        )
                    );
                    onUpload(url);
                } else {
                    setUploadingFiles(prev =>
                        prev.map(entry =>
                            entry.file === file
                                ? { ...entry, status: 'error', errorMsg: 'Error al subir' }
                                : entry
                        )
                    );
                }
            } catch {
                setUploadingFiles(prev =>
                    prev.map(entry =>
                        entry.file === file
                            ? { ...entry, status: 'error', errorMsg: 'Error de conexión' }
                            : entry
                    )
                );
            }
        }

        // Clean up done/error entries after a delay
        setTimeout(() => {
            setUploadingFiles(prev => prev.filter(e => e.status === 'uploading'));
        }, 3000);
    }, [accept, folder, onUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
            // Reset the input so the same file can be selected again
            e.target.value = '';
        }
    };

    const removeEntry = (index: number) => {
        setUploadingFiles(prev => {
            const entry = prev[index];
            if (entry.preview) URL.revokeObjectURL(entry.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const acceptLabels = {
        images: 'JPG, PNG, WebP, GIF',
        videos: 'MP4, WebM, MOV',
        all: 'JPG, PNG, WebP, GIF, MP4, WebM',
    };

    const isUploading = uploadingFiles.some(f => f.status === 'uploading');

    return (
        <div className="space-y-3">
            {label && (
                <label className={`block text-sm font-bold ${dark ? 'text-white' : 'text-[var(--text-main)]'}`}>
                    {label}
                </label>
            )}

            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
                    relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
                    ${compact ? 'py-4 px-4' : 'py-8 px-6'}
                    ${isDragging
                        ? dark
                            ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
                            : 'border-[#0d9488] bg-teal-50/80 scale-[1.01]'
                        : dark
                            ? 'border-white/15 bg-white/5 hover:border-blue-400/50 hover:bg-blue-500/5'
                            : 'border-gray-200 bg-gray-50/50 hover:border-teal-300 hover:bg-teal-50/30'
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_MAP[accept]}
                    multiple={multiple}
                    onChange={handleInputChange}
                    className="hidden"
                />

                <div className={`flex ${compact ? 'flex-row items-center gap-4' : 'flex-col items-center gap-3'}`}>
                    <div className={`
                        rounded-xl flex items-center justify-center transition-colors
                        ${compact ? 'w-10 h-10' : 'w-14 h-14'}
                        ${isDragging
                            ? dark ? 'bg-blue-500/20 text-blue-400' : 'bg-teal-100 text-[#0d9488]'
                            : dark ? 'bg-white/10 text-neutral-400' : 'bg-gray-100 text-gray-400'
                        }
                    `}>
                        <Upload className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
                    </div>

                    <div className={compact ? 'text-left' : 'text-center'}>
                        <p className={`font-bold ${compact ? 'text-sm' : 'text-sm'} ${isDragging
                            ? dark ? 'text-blue-400' : 'text-[#0d9488]'
                            : dark ? 'text-neutral-200' : 'text-[var(--text-main)]'
                            }`}>
                            {isDragging
                                ? 'Soltá el archivo aquí'
                                : 'Arrastrá archivos o hacé click para seleccionar'
                            }
                        </p>
                        <p className={`text-xs mt-1 ${dark ? 'text-neutral-500' : 'text-gray-400'}`}>
                            {helperText || `${acceptLabels[accept]} • Máx. 50MB`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload progress */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    {uploadingFiles.map((entry, index) => (
                        <div
                            key={`${entry.file.name}-${index}`}
                            className={`
                                flex items-center gap-3 p-3 rounded-xl border transition-all text-sm
                                ${entry.status === 'done'
                                    ? dark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
                                    : entry.status === 'error'
                                        ? dark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'
                                        : dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
                                }
                            `}
                        >
                            {/* Preview / Icon */}
                            {entry.preview ? (
                                <div
                                    className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0 border border-gray-200"
                                    style={{ backgroundImage: `url(${entry.preview})` }}
                                />
                            ) : isVideo(entry.file) ? (
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                    <Film className="w-5 h-5 text-purple-400" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            )}

                            {/* File info */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${dark ? 'text-white' : 'text-[var(--text-main)]'}`}>
                                    {entry.file.name}
                                </p>
                                <p className={`text-xs ${entry.status === 'error'
                                    ? 'text-red-400 font-medium'
                                    : dark ? 'text-neutral-500' : 'text-gray-400'
                                    }`}>
                                    {entry.status === 'error' && entry.errorMsg
                                        ? entry.errorMsg
                                        : formatSize(entry.file.size)
                                    }
                                </p>
                            </div>

                            {/* Status */}
                            {entry.status === 'uploading' && (
                                <Loader2 className="w-5 h-5 text-[#0d9488] animate-spin flex-shrink-0" />
                            )}
                            {entry.status === 'done' && (
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            )}
                            {entry.status === 'error' && (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeEntry(index); }}
                                        className="p-1 rounded hover:bg-red-100 text-red-400 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {isUploading && (
                        <p className="text-xs text-[#0d9488] font-medium text-center animate-pulse">
                            Subiendo archivos...
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
