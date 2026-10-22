import { useEffect } from 'react';
import { X, Copy, Check, Heart, Clock, Tag, Film, Image as ImageIcon, Lightbulb, AlertTriangle } from 'lucide-react';
import type { Prompt } from '@/types';
import { categoryMap } from '@/categories';
import { MediaPreview } from '@/components/MediaPreview';
import { StatusBadge } from '@/components/StatusBadge';

interface PromptModalProps {
  prompt: Prompt | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string) => void;
  copied: boolean;
  onClose: () => void;
}

const typeIcon: Record<string, typeof Film> = {
  Vídeo: Film,
  Imagem: ImageIcon,
  UGC: Film,
};

export function PromptModal({
  prompt,
  isFavorite,
  onToggleFavorite,
  onCopy,
  copied,
  onClose,
}: PromptModalProps) {
  useEffect(() => {
    if (!prompt) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [prompt, onClose]);

  if (!prompt) return null;

  const cat = categoryMap[prompt.category];
  const TypeIcon = typeIcon[prompt.type] ?? Film;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto scrollbar-thin rounded-2xl border border-white/10 bg-ink-800 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/5 bg-ink-800/95 backdrop-blur-sm">
          <span className="text-[11px] font-semibold text-gray-500">
            {prompt.id} · {cat?.icon} {cat?.label}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(prompt.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-white/5 transition-colors"
              aria-label="Favoritar"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-pink-500 text-pink-500' : ''
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left: large preview */}
          <div className="lg:w-[42%] flex-shrink-0 p-4 sm:p-5">
            <MediaPreview
              prompt={prompt}
              controls
              className="w-full aspect-[9/16] max-h-[60vh] lg:max-h-[70vh] mx-auto"
              rounded="rounded-xl"
            />
            <div className="mt-3 flex items-center justify-center">
              <StatusBadge prompt={prompt} size="md" />
            </div>
          </div>

          {/* Right: details */}
          <div className="flex-1 p-4 sm:p-5 lg:pl-1 lg:pr-5 space-y-4 lg:max-h-[80vh] lg:overflow-y-auto scrollbar-thin">
            <div>
              <span className="text-[11px] font-medium text-purple-400/70 uppercase tracking-wider">
                {cat?.icon} {cat?.label}
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white leading-tight">
                {prompt.title}
              </h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{prompt.description}</p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <MetaChip icon={<TypeIcon className="w-3 h-3" />} value={prompt.type} />
              {prompt.duration && <MetaChip icon={<Clock className="w-3 h-3" />} value={prompt.duration} />}
              <MetaChip icon={<Tag className="w-3 h-3" />} value={prompt.format} />
            </div>

            {/* Tags */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 text-gray-400 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Usage tip */}
            {prompt.usageTip && (
              <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                    Dica de uso
                  </p>
                </div>
                <p className="text-[12px] text-gray-300 leading-relaxed">{prompt.usageTip}</p>
              </div>
            )}

            {/* Avoid list */}
            {prompt.avoidList && prompt.avoidList.length > 0 && (
              <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/80">
                    Evite
                  </p>
                </div>
                <ul className="space-y-1">
                  {prompt.avoidList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-gray-400 leading-relaxed">
                      <span className="text-red-400/50 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                  Prompt completo
                </p>
                <button
                  onClick={() => onCopy(prompt.prompt)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                    copied
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar prompt
                    </>
                  )}
                </button>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl bg-ink-900 border border-white/5 p-4 text-[12.5px] leading-relaxed text-gray-300 font-mono scrollbar-thin max-h-[300px] overflow-y-auto">
                {prompt.prompt}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 text-gray-300 border border-white/5">
      {icon}
      {value}
    </span>
  );
}
