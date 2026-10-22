import { useRef, useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import type { Prompt } from '@/types';
import { categoryMap, getCategoryStyle } from '@/categories';

interface MediaPreviewProps {
  prompt: Prompt;
  className?: string;
  showLabel?: boolean;
  rounded?: string;
  controls?: boolean;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export function MediaPreview({
  prompt,
  className = '',
  showLabel = true,
  rounded = 'rounded-xl',
  controls = false,
}: MediaPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const cat = categoryMap[prompt.category];
  const style = getCategoryStyle(prompt.category);

  const hasVideo = prompt.mediaUrl && isVideoUrl(prompt.mediaUrl) && !videoFailed;
  const hasFallbackPlayer = videoFailed && prompt.cloudinaryPlayerUrl;
  const hasImage = (prompt.mediaUrl && !isVideoUrl(prompt.mediaUrl)) || prompt.thumbnailUrl;

  // IntersectionObserver for autoplay when visible
  useEffect(() => {
    if (!hasVideo || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = videoRef.current;
          if (!v) return;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasVideo]);

  const handlePlayToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  // Cloudinary iframe fallback
  if (hasFallbackPlayer) {
    return (
      <div
        className={`relative overflow-hidden bg-ink-900 ${rounded} ${className}`}
      >
        <iframe
          src={prompt.cloudinaryPlayerUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          title={prompt.title}
        />
      </div>
    );
  }

  // Video preview
  if (hasVideo) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-ink-900 ${rounded} ${className}`}
      >
        <video
          ref={videoRef}
          src={prompt.mediaUrl}
          poster={prompt.thumbnailUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={controls}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setVideoFailed(true)}
          className="w-full h-full object-cover"
        />
        {!controls && !isPlaying && (
          <button
            onClick={handlePlayToggle}
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity"
            aria-label="Reproduzir"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 transition-transform hover:scale-110">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </span>
          </button>
        )}
      </div>
    );
  }

  // Image preview (thumbnail or mediaUrl as image)
  if (hasImage) {
    const imgSrc = prompt.thumbnailUrl || prompt.mediaUrl;
    return (
      <div className={`relative overflow-hidden bg-ink-900 ${rounded} ${className}`}>
        <img
          src={imgSrc}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay for text legibility */}
        {showLabel && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
        {showLabel && (
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">
                {cat?.label}
              </span>
              <p className="text-sm font-bold text-white/90 leading-tight mt-0.5 line-clamp-1">
                {prompt.title}
              </p>
            </div>
            <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">
              {prompt.duration ? `${prompt.duration} • ${prompt.format}` : prompt.format}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Generated visual cover — no media at all
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} ${rounded} ${className}`}
    >
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: style.glow }}
        />
        <div
          className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: style.glow }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        {showLabel && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            {cat?.label}
          </span>
        )}
        <span className="text-4xl sm:text-5xl mb-3 opacity-70 drop-shadow-lg">
          {cat?.icon ?? '🎬'}
        </span>
        {showLabel && (
          <>
            <p className="text-sm sm:text-base font-bold text-white/90 leading-tight max-w-[80%] line-clamp-2">
              {prompt.title}
            </p>
            <p className="mt-2 text-[11px] text-white/40 font-medium">
              {prompt.duration ? `${prompt.duration} • ${prompt.format}` : prompt.format}
            </p>
          </>
        )}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
          <Film className="w-3 h-3 text-white/25" />
          <span className="text-[9px] uppercase tracking-wider text-white/25 font-medium">
            Demonstração em breve
          </span>
        </div>
      </div>
    </div>
  );
}
