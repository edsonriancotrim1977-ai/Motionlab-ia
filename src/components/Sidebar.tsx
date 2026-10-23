import { useState } from 'react';
import { Film, X, Home as HomeIcon, LayoutGrid, Heart, Rocket, LogIn, UserPlus, LogOut, Crown, Mail, Lock, Loader2 } from 'lucide-react';
import { categories } from '@/categories';
import type { View } from '@/App';
import type { User } from '@supabase/supabase-js';

interface SidebarProps {
  current: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
  user: User | null;
  isPremium: boolean;
  onSignIn: (email: string, password: string) => Promise<unknown>;
  onSignUp: (email: string, password: string) => Promise<unknown>;
  onSignOut: () => Promise<void>;
  authLoading: boolean;
}

export function Sidebar({
  current,
  onNavigate,
  isOpen,
  onClose,
  favoritesCount,
  user,
  isPremium,
  onSignIn,
  onSignUp,
  onSignOut,
  authLoading,
}: SidebarProps) {
  const isHome = current === 'home';
  const isAll = current === 'all';
  const isFav = current === 'favorites';
  const isLaunch = current === 'lancamentos';
  const activeCat = typeof current === 'object' ? current.category : null;

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const itemClass = (active: boolean) =>
    `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
      active
        ? 'bg-purple-500/15 text-white border border-purple-500/20 glow-purple-soft'
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthBusy(true);
    try {
      if (authMode === 'login') {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setAuthBusy(false);
    }
  };

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
              <HomeIcon className="w-4 h-4" />
              Início
            </button>
            <button onClick={() => onNavigate('lancamentos')} className={itemClass(isLaunch)}>
              <Rocket className="w-4 h-4" />
              Lançamentos
              {isLaunch && (
                <span className="ml-auto text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                  NOVO
                </span>
              )}
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

        {/* Auth section / Footer */}
        <div className="px-3 py-3.5 border-t border-white/[0.04]">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-[11px] font-bold text-white">
                  {user.email?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isPremium ? (
                      <>
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Premium</span>
                      </>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Conta grátis</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onSignOut()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-1 p-0.5 rounded-lg bg-white/5">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    authMode === 'login' ? 'bg-purple-500/20 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    authMode === 'signup' ? 'bg-purple-500/20 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Criar conta
                </button>
              </div>
              <form onSubmit={handleAuth} className="space-y-1.5">
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-ink-900 border border-white/[0.08] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    required
                    minLength={6}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-ink-900 border border-white/[0.08] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors"
                  />
                </div>
                {authError && (
                  <p className="text-[10px] text-red-400 px-1">{authError}</p>
                )}
                <button
                  type="submit"
                  disabled={authBusy || authLoading}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                >
                  {authBusy ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : authMode === 'login' ? (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      Entrar
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Criar conta
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
