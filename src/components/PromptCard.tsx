import { Copy, Check, Heart, Eye } from 'lucide-react';
import type { Prompt } from '@/types';
import { categoryMap } from '@/categories';
import { MediaPreview } from '@/components/MediaPreview';
import { StatusBadge } from '@/components/StatusBadge';

interface PromptCardProps {
  prompt: Prompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string) => void;
  copiedId: string | null;
  onOpenDetails: (prompt: Prompt) => void;
}

export function PromptCard({
  prompt,
  isFavorite,
  onToggleFavorite,
  onCopy,
  copiedId,
  onOpenDetails,
}: PromptCardProps) {
  const cat = categoryMap[prompt.category];
  const isCopied = copiedId === prompt.id;

  return (
    <div className="group card-hover relative flex flex-col rounded-2xl border border-white/[0.06] bg-ink-800/60 hover:border-purple-500/25 hover:shadow-[0_12px_50px_-16px_rgba(168,85,247,0.2)] overflow-hidden">
      {/* Preview area — large, ~55% of card visual weight */}
      <div className="relative aspect-[5/4] sm:aspect-[9/10] overflow-hidden">
        <MediaPreview
          prompt={prompt}
          rounded="rounded-none"
          className="w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(prompt.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95 z-10"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white/70 hover:text-pink-400'
            }`}
          />
        </button>

        {/* ID badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider bg-black/40 backdrop-blur-sm text-white/50 border border-white/10 z-10">
          {prompt.id}
        </span>

        {/* Status badge — bottom of preview */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <StatusBadge prompt={prompt} />
        </div>
      </div>

      {/* Content below preview */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        <span className="text-[10px] font-medium text-purple-400/70 uppercase tracking-wider truncate">
          {cat?.icon} {cat?.label}
        </span>

        <h3 className="text-[14px] font-semibold text-white leading-snug line-clamp-1">
          {prompt.title}
        </h3>

        <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2">
          {prompt.description}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
          {prompt.duration && (
            <>
              <span>{prompt.duration}</span>
              <span className="text-gray-700">•</span>
            </>
          )}
          <span>{prompt.format}</span>
          <span className="text-gray-700">•</span>
          <span>{prompt.type}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2.5">
          <button
            onClick={() => onCopy(prompt.prompt)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
              isCopied
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-[0_4px_16px_-4px_rgba(168,85,247,0.35)] hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isCopied ? (
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
          <button
            onClick={() => onOpenDetails(prompt)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
