"use client";

// Save as: components/GalleryTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: string;
  media_type: 'photo' | 'video';
  storage_path: string;
  url: string;
  caption: string | null;
  created_at: string;
}

const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 50;

export default function GalleryTabComponent() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [caption, setCaption] = useState('');
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch gallery error:', error);
      alert('❌ Failed to load gallery: ' + error.message);
    } else {
      setItems((data || []) as GalleryItem[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const uploaded: GalleryItem[] = [];
    const failed: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        failed.push(`${file.name} (unsupported file type)`);
        continue;
      }

      const maxBytes = (isImage ? MAX_IMAGE_MB : MAX_VIDEO_MB) * 1024 * 1024;
      if (file.size > maxBytes) {
        failed.push(`${file.name} (over ${isImage ? MAX_IMAGE_MB : MAX_VIDEO_MB}MB limit)`);
        continue;
      }

      setUploadProgressText(`Uploading ${i + 1} of ${files.length}: ${file.name}`);

      const ext = file.name.split('.').pop();
      const path = `${isImage ? 'photos' : 'videos'}/${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;

      const { error: uploadErr } = await supabase.storage.from('gallery').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadErr) {
        console.error('Upload error:', uploadErr);
        failed.push(`${file.name} (${uploadErr.message})`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(path);

      const { data: row, error: insertErr } = await supabase
        .from('gallery')
        .insert([
          {
            media_type: isImage ? 'photo' : 'video',
            storage_path: path,
            url: publicUrlData.publicUrl,
            caption: caption.trim() || null,
          },
        ])
        .select()
        .single();

      if (insertErr) {
        console.error('Insert gallery row error:', insertErr);
        failed.push(`${file.name} (saved file but failed to record it: ${insertErr.message})`);
        continue;
      }

      uploaded.push(row as GalleryItem);
    }

    if (uploaded.length > 0) {
      setItems([...uploaded, ...items]);
    }

    setIsUploading(false);
    setUploadProgressText('');
    setCaption('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (failed.length > 0) {
      alert(`✅ Uploaded ${uploaded.length} file(s).\n❌ Failed:\n${failed.join('\n')}`);
    } else if (uploaded.length > 0) {
      alert(`🎉 Uploaded ${uploaded.length} file(s) to the gallery!`);
    }
  };

  const handleDeleteOne = async (item: GalleryItem) => {
    if (!confirm('Delete this item from the gallery? This cannot be undone.')) return;

    const { error: storageErr } = await supabase.storage.from('gallery').remove([item.storage_path]);
    if (storageErr) {
      console.error('Storage delete error:', storageErr);
      // Continue anyway - still try to remove the DB row so the gallery doesn't show a broken link
    }

    const { error: dbErr } = await supabase.from('gallery').delete().eq('id', item.id);
    if (dbErr) {
      alert('❌ Failed to delete: ' + dbErr.message);
      return;
    }

    setItems(items.filter((i) => i.id !== item.id));
    setSelectedIds(selectedIds.filter((id) => id !== item.id));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected item(s)? This cannot be undone.`)) return;

    const toDelete = items.filter((i) => selectedIds.includes(i.id));
    const paths = toDelete.map((i) => i.storage_path);

    const { error: storageErr } = await supabase.storage.from('gallery').remove(paths);
    if (storageErr) {
      console.error('Bulk storage delete error:', storageErr);
    }

    const { error: dbErr } = await supabase.from('gallery').delete().in('id', selectedIds);
    if (dbErr) {
      alert('❌ Failed to delete selected items: ' + dbErr.message);
      return;
    }

    setItems(items.filter((i) => !selectedIds.includes(i.id)));
    setSelectedIds([]);
  };

  const filteredItems = items.filter((i) => filter === 'all' || i.media_type === filter);

  return (
    <div className="space-y-8">
      {/* UPLOAD FORM */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="border-b pb-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span>🖼️</span> Upload Gallery Photos / Videos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select multiple photos (max {MAX_IMAGE_MB}MB each) or videos (max {MAX_VIDEO_MB}MB each). They appear on the public Gallery page immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 uppercase mb-1">Caption (optional, applies to this batch)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Annual Day 2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>

        {isUploading && (
          <div className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2">
            ⏳ {uploadProgressText || 'Uploading...'}
          </div>
        )}
      </div>

      {/* GALLERY LIST */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase">
            🖼️ Gallery Items ({filteredItems.length})
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'photo', 'video'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === f ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'photo' ? '📷 Photos' : '🎥 Videos'}
              </button>
            ))}
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                🗑️ Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold">⏳ Loading gallery...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold">No items yet. Upload some photos or videos above.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <label className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? [...selectedIds, item.id] : selectedIds.filter((id) => id !== item.id))
                    }
                    className="w-4 h-4 rounded"
                  />
                </label>

                <div className="aspect-square bg-slate-200">
                  {item.media_type === 'photo' ? (
                    <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" muted />
                  )}
                </div>

                <div className="p-2 space-y-1">
                  <p className="text-[10px] font-bold text-slate-700 truncate">{item.caption || '—'}</p>
                  <p className="text-[9px] text-slate-400">{item.media_type === 'photo' ? '📷 Photo' : '🎥 Video'}</p>
                </div>

                <button
                  onClick={() => handleDeleteOne(item)}
                  className="absolute bottom-2 right-2 px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded shadow opacity-0 group-hover:opacity-100 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}