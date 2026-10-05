"use client";

// Save as: app/gallery/page.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: string;
  media_type: 'photo' | 'video';
  url: string;
  caption: string | null;
  created_at: string;
}

// -------------------------------------------------------------------------
// Scroll-reveal wrapper: fades a tile up into place the first time it
// enters the viewport. Pure CSS transition + IntersectionObserver, no lib.
// -------------------------------------------------------------------------
function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('id,media_type,url,caption,created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch gallery error:', error);
      } else {
        setItems((data || []) as GalleryItem[]);
      }
      setIsLoading(false);
    };
    fetchGallery();
  }, []);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeLightbox]);

  const filteredItems = items.filter((i) => filter === 'all' || i.media_type === filter);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* HERO */}
      <div className="relative overflow-hidden bg-[#2D221C] text-[#FAF7F2] border-b-4 border-[#C29B72] py-16 sm:py-20 px-4">
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-20 animate-[pulse_6s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, #D8BD8E, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -left-20 bottom-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D8BD8E, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-[#D8BD8E] mb-3">
            Life at Manavta Institute, Bilari
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Gallery  🖼️</h1>
          <p className="text-md sm:text-base text-[#F2ECE1]/90 mt-3 max-w-xl mx-auto">
          "Shaping digital futures, one click at a time.
          Explore our journey of transforming students into IT professionals."
          </p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFC8] p-1.5 flex gap-1.5">
            {(['all', 'photo', 'video'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  filter === f
                    ? 'bg-[#2D221C] text-white shadow'
                    : 'text-[#52443C] hover:bg-[#F2ECE1]'
                }`}
              >
                {f === 'all' ? 'All' : f === 'photo' ? '📷 Photos' : '🎥 Videos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isLoading ? (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl bg-[#F2ECE1] animate-pulse"
                style={{ height: `${160 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm font-bold text-[#8A7A6F]">No {filter !== 'all' ? filter + 's' : 'photos or videos'} uploaded yet.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, idx) => (
              <RevealOnScroll key={item.id} delay={(idx % 8) * 60}>
                <button
                  onClick={() => setLightboxItem(item)}
                  className="break-inside-avoid block w-full rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  {item.media_type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.caption || 'Gallery photo'}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="relative">
                      <video src={item.url} className="w-full h-auto object-cover" muted preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <div
                            className="w-0 h-0 ml-1"
                            style={{
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderLeft: '13px solid #6B1F2A',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Caption overlay on hover */}
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-bold truncate">{item.caption}</p>
                    </div>
                  )}
                </button>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease-out]"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl font-bold transition"
            aria-label="Close"
          >
            ✕
          </button>

          <div
            className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.media_type === 'photo' ? (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.caption || 'Gallery photo'}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl bg-black"
              />
            )}
            {lightboxItem.caption && (
              <p className="text-white text-sm font-semibold mt-4 text-center">{lightboxItem.caption}</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}