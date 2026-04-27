import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, User } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';

export const ProfileImageUpload = ({ currentPhotoURL }: { currentPhotoURL?: string | null }) => {
  const { user, getToken, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhotoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB");
      return;
    }

    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      if (!user) throw new Error("No user authenticated");
      
      const token = await getToken();
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        photoURL: url
      });

      // Refresh the user state in context
      await refreshUser();
      
      toast.success("Profile image updated and saved");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to update profile image");
      setPreview(currentPhotoURL || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-100 dark:border-zinc-700 shadow-sm transition-transform active:scale-95">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-zinc-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute -right-2 -bottom-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-110 active:scale-90"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1.5 translate-y-2">
        <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Avatar Projection</h4>
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">JPG, PNG or WEBP. Maximum 2MB.</p>
        <div className="h-2" />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border-zinc-200 dark:border-zinc-700 text-[9px] font-black uppercase tracking-widest h-8 px-4"
        >
          <Upload className="w-3.5 h-3.5 mr-2" /> Replace Asset
        </Button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};
