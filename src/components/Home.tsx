import { Search, Sparkles, Film, ArrowRight, Clock, Play } from 'lucide-react';
import { categories, categoryMap, getCategoryStyle } from '@/categories';
import { prompts } from '@/prompts';
import type { Prompt } from '@/types';
import type { View } from '@/App';
import { MediaPreview } from '@/components/MediaPreview';
import { StatusBadge } from '@/components/StatusBadge';

interface HomeProps {
  onNavigate: (view: View) => void;
  recent: Prompt[];
  onOpenDetails: (p: Prompt) => void;
  onSearch: (q: string) => void;
}

export function Home({ onNavigate, recent, onOpenDetails, onSearch }: HomeProps) {
  const testedCount = prompts.filter((p) => p.status === 'Testado').length;
  const categoryCount = categories.length;

  // "Comece por aqui" — prioritize tested prompts
  const starterPrompts = prompts
    .filter((p) => p.status === 'Testado')
    .slice(0, 3);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNavigate('all');
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.04] bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900 px-5 py-8 sm:px-10 sm:py-14">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/8 border border-purple-500/15 text-[10px] font-bold uppercase tracking-widest text-purple-300/80 mb-5">
            <Sparkles className="w-3 h-3" />
            Biblioteca Inteligente de Prompts
          </div>

          <h1 className="text-[28px] sm:text-[40px] font-bold text-white leading-[1.15] tracking-tight">
            Transforme imagens em
            <br />
            <span className="gradient-text">vídeos que chamam atenção.</span>
          </h1>

          <p className="mt-4 text-[13px] sm:text-[15px] text-gray-400 leading-relaxed max-w-xl">
            Prompts estruturados para movimentos, UGC, produtos e vídeos criados com inteligência artificial.
          </p>

          {/* Large search field */}
          <form onSubmit={handleSearch} className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Qual movimento você quer criar?"
              className="w-full pl-11 pr-32 py-3.5 rounded-xl bg-ink-900/80 border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-transform active:scale-95"
            >
              <Film className="w-3.5 h-3.5" />
              Explorar prompts
            </button>
          </form>
          <p className="mt-2 text-[11px] text-gray-600 pl-1">
            Busque por CTA, selfie, produto, POV, câmera...
          </p>

          {/* Metrics */}
          <div className="mt-7 flex flex-wrap gap-6 sm:gap-10">
            <Metric label="PROMPTS" value={prompts.length} />
            <Metric label="CATEGORIAS" value={categoryCount} />
            <Metric label="TESTADOS" value={testedCount} />
          </div>
        </div>
      </section>

      {/* Recent — only if exists */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-purple-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Vistos recentemente</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
            {recent.map((p) => {
              const cat = categoryMap[p.category];
              return (
                <button
                  key={p.id}
                  onClick={() => onOpenDetails(p)}
                  className="flex-shrink-0 w-44 text-left rounded-xl border border-white/[0.06] bg-ink-800 hover:border-purple-500/25 transition-all overflow-hidden group"
                >
                  <div className="aspect-[9/10] overflow-hidden">
                    <MediaPreview prompt={p} rounded="rounded-none" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2.5">
                    <span className="text-[10px] text-purple-400/60 uppercase tracking-wider">{cat?.label}</span>
                    <h3 className="mt-0.5 text-[12px] font-semibold text-white line-clamp-1">{p.title}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Comece por aqui */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">Comece por aqui</h2>
            <p className="mt-0.5 text-[12px] text-gray-500">Prompts testados e prontos para usar</p>
          </div>
          <button
            onClick={() => onNavigate('all')}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {starterPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenDetails(p)}
              className="group text-left rounded-2xl border border-white/[0.06] bg-ink-800/60 hover:border-purple-500/25 card-hover hover:shadow-[0_12px_50px_-16px_rgba(168,85,247,0.2)] overflow-hidden"
            >
              <div className="relative aspect-[9/10] overflow-hidden">
                <MediaPreview prompt={p} rounded="rounded-none" className="w-full h-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute bottom-2.5 left-2.5 z-10">
                  <StatusBadge prompt={p} />
                </div>
              </div>
              <div className="p-3.5">
                <span className="text-[10px] font-medium text-purple-400/70 uppercase tracking-wider">
                  {categoryMap[p.category]?.icon} {categoryMap[p.category]?.label}
                </span>
                <h3 className="mt-1 text-[14px] font-semibold text-white line-clamp-1">{p.title}</h3>
                <p className="mt-1 text-[12px] text-gray-400 line-clamp-2">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-base sm:text-lg font-bold text-white mb-4 uppercase tracking-wide">Prompts por categoria</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const count = prompts.filter((p) => p.category === cat.id).length;
            const style = getCategoryStyle(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate({ category: cat.id })}
                className={`group relative flex flex-col items-start gap-2 p-4 rounded-xl border border-white/[0.06] bg-ink-800/60 hover:border-purple-500/20 card-hover overflow-hidden text-left`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${style.gradient}`} />
                <span className="relative text-2xl">{cat.icon}</span>
                <span className="relative text-[12px] sm:text-[13px] font-semibold text-white leading-tight">
                  {cat.label}
                </span>
                <span className="relative text-[11px] text-gray-500">
                  {count} {count === 1 ? 'prompt' : 'prompts'}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-bold gradient-text leading-none">{value}</p>
      <p className="text-[10px] sm:text-[11px] text-gray-600 mt-1.5 font-semibold tracking-wider">{label}</p>
    </div>
  );
}
