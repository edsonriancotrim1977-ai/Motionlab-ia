import { useEffect, useState } from 'react';
import { X, Copy, Check, Heart, Clock, Tag, Film, Image as ImageIcon, Lightbulb, AlertTriangle, Lock, Crown, Rocket, ListChecks, Layers, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { Prompt, TakePrompt } from '@/types';
import { categoryMap } from '@/categories';
import { MediaPreview } from '@/components/MediaPreview';
import { StatusBadge } from '@/components/StatusBadge';
import { fetchPremiumPrompt } from '@/lib/premium';

interface PromptModalProps {
  prompt: Prompt | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string) => void;
  copied: boolean;
  onClose: () => void;
  isPremium: boolean;
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
  isPremium,
}: PromptModalProps) {
  const [premiumContent, setPremiumContent] = useState<{ prompt_text: string; take_prompts: TakePrompt[] | null } | null>(null);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [expandedTakes, setExpandedTakes] = useState<Set<number>>(new Set());

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

  // Fetch premium content when opening a paid prompt for premium users
  useEffect(() => {
    setPremiumContent(null);
    if (!prompt || prompt.access !== 'paid' || !isPremium) return;
    setPremiumLoading(true);
    fetchPremiumPrompt(prompt.id)
      .then((data) => {
        if (data) {
          setPremiumContent({
            prompt_text: data.prompt_text,
            take_prompts: data.take_prompts as TakePrompt[] | null,
          });
        }
      })
      .finally(() => setPremiumLoading(false));
  }, [prompt, isPremium]);

  if (!prompt) return null;

  const cat = categoryMap[prompt.category];
  const TypeIcon = typeIcon[prompt.type] ?? Film;
  const isPaid = prompt.access === 'paid';
  const isLocked = isPaid && !isPremium;
  const isLaunch = prompt.isLaunch === true;

  // Determine which prompt text and takePrompts to show
  const displayPromptText = isLocked
    ? null
    : (premiumContent?.prompt_text ?? prompt.prompt);
  const displayTakePrompts = isLocked
    ? null
    : (premiumContent?.take_prompts ?? prompt.takePrompts);

  const toggleTake = (idx: number) => {
    setExpandedTakes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

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
            <div className="mt-3 flex items-center justify-center gap-2">
              <StatusBadge prompt={prompt} size="md" />
              {isLaunch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                  <Rocket className="w-3 h-3" />
                  Lançamento
                </span>
              )}
              {prompt.isFreePreview && prompt.previewLabel && (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  {prompt.previewLabel}
                </span>
              )}
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

            {/* Required inputs */}
            {prompt.requiredInputs && prompt.requiredInputs.length > 0 && (
              <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3.5">
                <div className="flex items-center gap-2 mb-2.5">
                  <ListChecks className="w-3.5 h-3.5 text-blue-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">
                    Referências necessárias
                  </p>
                </div>
                <div className="space-y-1.5">
                  {prompt.requiredInputs.map((input) => (
                    <div key={input.order} className="flex items-start gap-2 text-[12px] text-gray-300 leading-relaxed">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-blue-500/15 text-blue-400 text-[10px] font-bold">
                        {input.order}
                      </span>
                      <div>
                        <span className="font-semibold text-white">{input.label}</span>
                        <span className="block text-[11px] text-gray-500 mt-0.5">{input.purpose}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional inputs */}
            {prompt.optionalInputs && prompt.optionalInputs.length > 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Referências opcionais
                </p>
                <div className="space-y-1.5">
                  {prompt.optionalInputs.map((input, i) => (
                    <div key={i} className="flex items-start gap-2 text-[12px] text-gray-400 leading-relaxed">
                      <span className="text-gray-600 mt-0.5">○</span>
                      <div>
                        <span className="font-medium text-gray-300">{input.label}</span>
                        <span className="block text-[11px] text-gray-600 mt-0.5">{input.purpose}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Method */}
            {prompt.method && (
              <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400/80">
                    Método: {prompt.method.name}
                  </p>
                </div>
                {prompt.method.fullVideo && (
                  <p className="text-[11px] text-purple-300/70 mb-2 font-medium">📹 {prompt.method.fullVideo}</p>
                )}
                {prompt.method.partialUse && (
                  <p className="text-[11px] text-gray-400 mb-2">{prompt.method.partialUse}</p>
                )}
                {prompt.method.steps && prompt.method.steps.length > 0 && (
                  <ol className="space-y-1.5">
                    {prompt.method.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-gray-300 leading-relaxed">
                        <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md bg-purple-500/15 text-purple-400 text-[10px] font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

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

            {/* Premium locked state */}
            {isLocked ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/25 mx-auto mb-3">
                  <Lock className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1">Conteúdo Premium</h3>
                <p className="text-[12px] text-gray-400 leading-relaxed max-w-sm mx-auto">
                  Este prompt faz parte do pacote de lançamento premium. Faça login com uma conta premium para desbloquear o prompt completo e todos os takes.
                </p>
              </div>
            ) : premiumLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <span className="text-[12px]">Carregando conteúdo premium...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Take prompts (collapsible) */}
                {displayTakePrompts && displayTakePrompts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                        Takes ({displayTakePrompts.length})
                      </p>
                    </div>
                    <div className="space-y-2">
                      {displayTakePrompts.map((take, idx) => {
                        const expanded = expandedTakes.has(idx);
                        return (
                          <div key={idx} className="rounded-xl border border-white/[0.06] bg-ink-900/50 overflow-hidden">
                            <button
                              onClick={() => toggleTake(idx)}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/15 text-purple-400 text-[10px] font-bold">
                                  {take.take}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[12px] font-semibold text-white truncate">{take.title}</p>
                                  <p className="text-[10px] text-gray-500">{take.duration}</p>
                                </div>
                              </div>
                              {expanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            {expanded && (
                              <div className="px-3.5 pb-3.5 space-y-2">
                                <pre className="whitespace-pre-wrap rounded-lg bg-ink-900 border border-white/5 p-3 text-[11.5px] leading-relaxed text-gray-300 font-mono scrollbar-thin max-h-[200px] overflow-y-auto">
                                  {take.prompt}
                                </pre>
                                <button
                                  onClick={() => onCopy(take.prompt)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copiar Take {take.take}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Full prompt */}
                {displayPromptText && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                        {displayTakePrompts ? 'Prompt completo (resumo)' : 'Prompt completo'}
                      </p>
                      <button
                        onClick={() => onCopy(displayPromptText)}
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
                      {displayPromptText}
                    </pre>
                  </div>
                )}
              </>
            )}
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
