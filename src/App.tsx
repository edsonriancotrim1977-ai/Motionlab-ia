import { useCallback, useMemo, useState } from 'react';
import { Menu, Film, SearchX } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { PromptCard } from '@/components/PromptCard';
import { PromptModal } from '@/components/PromptModal';
import { Filters } from '@/components/Filters';
import type { FilterState } from '@/components/Filters';
import { Home } from '@/components/Home';
import { categories, categoryMap } from '@/categories';
import { prompts } from '@/prompts';
import type { Prompt } from '@/types';
import { useLocalStorage } from '@/hooks';

export type View = 'home' | 'all' | 'favorites' | { category: string };

const RECENT_KEY = 'motionlab:recent';
const RECENT_MAX = 8;
const FAV_KEY = 'motionlab:favorites';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'Todos',
    type: 'Todos',
    format: 'Todos',
    duration: 'Todos',
  });
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const [favorites, setFavorites] = useLocalStorage<string[]>(FAV_KEY, []);
  const [recent, setRecent] = useLocalStorage<Prompt[]>(RECENT_KEY, []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

  const navigate = useCallback((v: View) => {
    setView(v);
    setSidebarOpen(false);
    setQuery('');
    setFilters({ status: 'Todos', type: 'Todos', format: 'Todos', duration: 'Todos' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
      );
    },
    [setFavorites],
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch {
          /* ignore */
        }
        document.body.removeChild(ta);
      });
  }, []);

  const handleCardCopy = useCallback(
    (prompt: Prompt) => {
      handleCopy(prompt.prompt);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId((prev) => (prev === prompt.id ? null : prev)), 2000);
    },
    [handleCopy],
  );

  const handleModalCopy = useCallback(
    (prompt: Prompt) => {
      handleCopy(prompt.prompt);
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2000);
    },
    [handleCopy],
  );

  const openDetails = useCallback(
    (prompt: Prompt) => {
      setSelectedPrompt(prompt);
      setRecent((prev) => {
        const filtered = prev.filter((p) => p.id !== prompt.id);
        return [prompt, ...filtered].slice(0, RECENT_MAX);
      });
    },
    [setRecent],
  );

  // Filtering logic
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // Category filter
    if (typeof view === 'object') {
      result = result.filter((p) => p.category === view.category);
    }

    // Favorites view
    if (view === 'favorites') {
      result = result.filter((p) => favorites.includes(p.id));
    }

    // Status filter
    if (filters.status === 'Favoritos') {
      result = result.filter((p) => favorites.includes(p.id));
    }

    // Type filter
    if (filters.type !== 'Todos') {
      result = result.filter((p) => p.type === filters.type);
    }

    // Format filter
    if (filters.format !== 'Todos') {
      result = result.filter((p) => p.format === filters.format);
    }

    // Duration filter
    if (filters.duration !== 'Todos') {
      result = result.filter((p) => p.duration === filters.duration);
    }

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (categoryMap[p.category]?.label.toLowerCase().includes(q) ?? false) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.prompt.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [view, filters, query, favorites]);

  // Heading for content area
  const heading = useMemo(() => {
    if (view === 'home') return null;
    if (view === 'all') return { title: 'Todos os Prompts', subtitle: `${filteredPrompts.length} prompts cadastrados` };
    if (view === 'favorites') return { title: 'Favoritos', subtitle: `${favorites.length} ${favorites.length === 1 ? 'prompt favoritado' : 'prompts favoritados'}` };
    const cat = typeof view === 'object' ? categoryMap[view.category] : null;
    return cat
      ? { title: `${cat.icon} ${cat.label}`, subtitle: `${filteredPrompts.filter((p) => p.category === cat.id).length} prompts nesta categoria` }
      : null;
  }, [view, favorites, filteredPrompts]);

  const isHome = view === 'home';
  const showFilters = !isHome;

  const resetFilters = () => {
    setQuery('');
    setFilters({ status: 'Todos', type: 'Todos', format: 'Todos', duration: 'Todos' });
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <Sidebar
        current={view}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        favoritesCount={favorites.length}
      />

      <div className="lg:pl-[260px]">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-ink-900/90 backdrop-blur-sm border-b border-white/[0.04] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">MotionLab AI</span>
          </div>
        </div>

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
          {isHome ? (
            <Home
              onNavigate={navigate}
              recent={recent}
              onOpenDetails={openDetails}
              onSearch={setQuery}
            />
          ) : (
            <div className="space-y-5 animate-fade-in">
              {heading && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {heading.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{heading.subtitle}</p>
                </div>
              )}

              {showFilters && (
                <Filters
                  query={query}
                  onQueryChange={setQuery}
                  filters={filters}
                  onFiltersChange={setFilters}
                  resultCount={filteredPrompts.length}
                />
              )}

              {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {filteredPrompts.map((p) => (
                    <PromptCard
                      key={p.id}
                      prompt={p}
                      isFavorite={favorites.includes(p.id)}
                      onToggleFavorite={toggleFavorite}
                      onCopy={() => handleCardCopy(p)}
                      copiedId={copiedId}
                      onOpenDetails={openDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/5 mb-5">
                    <SearchX className="w-7 h-7 text-gray-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-300">
                    Nenhum prompt encontrado.
                  </p>
                  <p className="mt-1.5 text-[13px] text-gray-600 max-w-xs">
                    Experimente buscar outro movimento ou remover alguns filtros.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-transform active:scale-95"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <div className="border-t border-white/[0.04] pt-6 text-center">
            <p className="text-sm font-semibold text-white">MotionLab AI</p>
            <p className="mt-1 text-[12px] text-gray-600">
              Biblioteca inteligente de prompts para criação com IA.
            </p>
          </div>
        </footer>
      </div>

      {/* Prompt detail modal */}
      <PromptModal
        prompt={selectedPrompt}
        isFavorite={selectedPrompt ? favorites.includes(selectedPrompt.id) : false}
        onToggleFavorite={toggleFavorite}
        onCopy={() => selectedPrompt && handleModalCopy(selectedPrompt)}
        copied={modalCopied}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  );
}
