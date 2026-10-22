import { Film, X, Home, LayoutGrid, Heart } from 'lucide-react';
import { categories } from '@/categories';
import type { View } from '@/App';

interface SidebarProps {
  current: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
}

export function Sidebar({ current, onNavigate, isOpen, onClose, favoritesCount }: SidebarProps) {
  const isHome = current === 'home';
  const isAll = current === 'all';
  const isFav = current === 'favorites';
  const activeCat = typeof current === 'object' ? current.category : null;

  const itemClass = (active: boolean) =>
    `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
      active
        ? 'bg-purple-500/15 text-white border border-purple-500/20 glow-purple-soft'
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-[260px] flex flex-col border-r border-white/[0.04] bg-ink-850 lg:translate-x-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3.5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 glow-purple-soft">
              <Film className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-[14px] font-bold tracking-tight text-white leading-none">
                MotionLab AI
              </h1>
              <p className="text-[10px] text-gray-500 leading-none mt-1">Biblioteca de Prompts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
          {/* Principal */}
          <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-700">
            Principal
          </p>
          <div className="space-y-0.5">
            <button onClick={() => onNavigate('home')} className={itemClass(isHome)}>
              <Home className="w-4 h-4" />
              Início
            </button>
            <button onClick={() => onNavigate('all')} className={itemClass(isAll)}>
              <LayoutGrid className="w-4 h-4" />
              Todos os Prompts
            </button>
            <button onClick={() => onNavigate('favorites')} className={itemClass(isFav)}>
              <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-400 text-pink-400' : ''}`} />
              Favoritos
              {favoritesCount > 0 && (
                <span className="ml-auto text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <p className="px-2.5 mt-4 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-700">
            Categorias
          </p>
          <div className="space-y-0.5">
            {categories.map((cat) => {
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate({ category: cat.id })}
                  className={itemClass(isActive)}
                >
                  <span className="text-[15px] leading-none w-4 text-center">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-white/[0.04]">
          <p className="text-[11px] text-gray-600 leading-relaxed">
            MotionLab AI
            <br />
            Biblioteca inteligente de prompts para criação com IA.
          </p>
        </div>
      </aside>
    </>
  );
}
