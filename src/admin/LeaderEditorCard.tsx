import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  ExternalLink, 
  RotateCcw,
  Cloud,
  Link as LinkIcon
} from 'lucide-react';
import { LeaderMember } from '../landing/landingContentStore';
import { uploadLeaderPhoto } from '../lib/storage';

interface LeaderEditorCardProps {
  key?: React.Key;
  member: LeaderMember;
  index: number;
  section: 'ifswRegion' | 'subcommittee';
  sectionLabel: string;
  defaultFallbackImage?: string;
  onChange: (index: number, field: keyof LeaderMember, value: string) => void;
  onRemove: (index: number) => void;
}

export function LeaderEditorCard({
  member,
  index,
  section,
  sectionLabel,
  defaultFallbackImage = '/subcommittee/Felix Kakowa.jpg',
  onChange,
  onRemove,
}: LeaderEditorCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlField, setShowUrlField] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isSupabaseStorageUrl = 
    member.image?.includes('supabase.co/storage') || 
    member.image?.includes('/storage/v1/object');

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const folder = section === 'ifswRegion' ? 'ifsw' : 'subcommittee';
      const result = await uploadLeaderPhoto(file, folder);

      if (result.success && result.url) {
        onChange(index, 'image', result.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      } else {
        setUploadError(result.error || 'Failed to upload photo to Supabase Storage.');
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setUploadError(err?.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
    // reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUploadFile(file);
    }
  };

  return (
    <div 
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-white ${
        isDragOver 
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md' 
          : 'border-gray-200/90 hover:border-gray-300 shadow-sm'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Profile Picture & Upload Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer shadow-inner flex items-center justify-center shrink-0"
            title="Click to upload new photo to Supabase Storage"
          >
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                <ImageIcon size={24} />
              </div>
            )}

            {/* Hover overlay with Upload prompt */}
            <div className="absolute inset-0 bg-emerald-950/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1 text-center">
              <Upload size={16} className="text-white" />
              <span className="text-[10px] font-bold leading-tight">Upload</span>
            </div>

            {/* Uploading Spinner */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center text-emerald-700">
                <Loader2 size={20} className="animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin text-emerald-700" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : (
                <>
                  <Upload size={13} className="text-emerald-700" />
                  <span>Upload Photo</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowUrlField(!showUrlField)}
                className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
                title="Toggle manual image URL"
              >
                <LinkIcon size={11} />
                <span>{showUrlField ? 'Hide URL' : 'Image URL'}</span>
              </button>

              {member.image && member.image !== defaultFallbackImage && (
                <button
                  type="button"
                  onClick={() => onChange(index, 'image', defaultFallbackImage)}
                  className="text-[11px] text-gray-400 hover:text-amber-700 flex items-center gap-0.5 transition-colors"
                  title="Reset to default local image"
                >
                  <RotateCcw size={10} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Storage Status Tag */}
            {isSupabaseStorageUrl ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold w-fit">
                <Cloud size={11} className="text-emerald-600" />
                <span>Supabase Storage</span>
              </span>
            ) : member.image?.startsWith('data:image') ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold w-fit">
                <span>Embedded Image</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium w-fit">
                <span>Local Asset</span>
              </span>
            )}
          </div>
        </div>

        {/* Member Name and Role Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">Full Name</label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => onChange(index, 'name', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Oluwatoni Adeleke"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">Position / Committee Role</label>
            <input
              type="text"
              value={member.role}
              onChange={(e) => onChange(index, 'role', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Regional President"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex sm:flex-col items-center justify-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
            title={`Remove ${sectionLabel}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Manual Image URL Input if toggled */}
      {showUrlField && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <div className="text-[11px] font-bold text-gray-600 whitespace-nowrap">Image Link:</div>
          <input
            type="text"
            value={member.image || ''}
            onChange={(e) => onChange(index, 'image', e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-mono bg-gray-50 text-gray-700 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            placeholder="https://... or /ifsw/filename.jpg"
          />
          {member.image && (
            <a 
              href={member.image} 
              target="_blank" 
              rel="noreferrer"
              className="p-1.5 text-gray-500 hover:text-emerald-700 rounded-md hover:bg-gray-100 transition-colors"
              title="Open full photo in new tab"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      )}

      {/* Upload Feedback Notices */}
      {uploadSuccess && (
        <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span className="font-medium">Photo uploaded directly to Supabase Storage bucket!</span>
        </div>
      )}

      {uploadError && (
        <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 animate-in fade-in">
          <AlertCircle size={14} className="text-rose-600 shrink-0" />
          <span className="font-medium">{uploadError}</span>
        </div>
      )}
    </div>
  );
}
