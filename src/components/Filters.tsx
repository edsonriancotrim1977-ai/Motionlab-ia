import { Search, Heart, Check, Clock, Film, Image, Tag, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { PromptType, PromptFormat, PromptDuration } from '@/types';

export type FilterStatus = 'Todos' | 'Testados' | 'A testar' | 'Favoritos';

export interface FilterState {
  status: FilterStatus;
  type: PromptType | 'Todos';
  format: PromptFormat | 'Todos';
  duration: PromptDuration | 'Todos';
}

interface FiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  resultCount: number;
}

const statusOptions: FilterStatus[] = ['Todos', 'Testados', 'A testar', 'Favoritos'];
const typeOptions: (PromptType | 'Todos')[] = ['Todos', 'Vídeo', 'Imagem', 'UGC'];
const formatOptions: (PromptFormat | 'Todos')[] = ['Todos', '9:16', '16:9', '1:1'];
const durationOptions: (PromptDuration | 'Todos')[] = ['Todos', '5s', '8s', '10s'];

export function Filters({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  resultCount,
}: FiltersProps) {
  const hasActiveFilters =
    filters.status !== 'Todos' ||
    filters.type !== 'Todos' ||
    filters.format !== 'Todos' ||
    filters.duration !== 'Todos' ||
    query !== '';

  const reset = () => {
    onQueryChange('');
    onFiltersChange({ status: 'Todos', type: 'Todos', format: 'Todos', duration: 'Todos' });
  };

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Busque por movimento, produto, CTA, POV..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-ink-800 border border-white/[0.06] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 transition-all"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-500 hover:text-white transition-colors"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Compact filter bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Dropdown
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(v) => onFiltersChange({ ...filters, status: v as FilterStatus })}
          optionIcons={{
            Testados: <Check className="w-3 h-3" />,
            'A testar': <Clock className="w-3 h-3" />,
            Favoritos: <Heart className="w-3 h-3" />,
          }}
        />

        <Dropdown
          label="Tipo"
          options={typeOptions}
          value={filters.type}
          onChange={(v) => onFiltersChange({ ...filters, type: v as PromptType | 'Todos' })}
          optionIcons={{
            Vídeo: <Film className="w-3 h-3" />,
            Imagem: <Image className="w-3 h-3" />,
            UGC: <Film className="w-3 h-3" />,
          }}
        />

        <Dropdown
          label="Formato"
          options={formatOptions}
          value={filters.format}
          onChange={(v) => onFiltersChange({ ...filters, format: v as PromptFormat | 'Todos' })}
          optionIcons={{
            '9:16': <Tag className="w-3 h-3" />,
            '16:9': <Tag className="w-3 h-3" />,
            '1:1': <Tag className="w-3 h-3" />,
          }}
        />

        <Dropdown
          label="Duração"
          options={durationOptions}
          value={filters.duration}
          onChange={(v) => onFiltersChange({ ...filters, duration: v as PromptDuration | 'Todos' })}
        />

        {hasActiveFilters && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-purple-400 hover:text-white hover:bg-purple-500/10 transition-colors ml-auto border border-purple-500/20 bg-purple-500/5"
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>

      <p className="text-[12px] text-gray-500">
        {resultCount} {resultCount === 1 ? 'prompt encontrado' : 'prompts encontrados'}
      </p>
    </div>
  );
}

interface DropdownProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  optionIcons?: Partial<Record<T, React.ReactNode>>;
}

function Dropdown<T extends string>({ label, options, value, onChange, optionIcons }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const isFiltered = value !== 'Todos';
  const isAll = value === 'Todos';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
          isFiltered
            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
            : 'bg-white/5 text-gray-400 border border-white/[0.06] hover:text-white hover:bg-white/10'
        }`}
      >
        {isAll ? label : <span className="inline-flex items-center gap-1">{optionIcons?.[value]}{value}</span>}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-30 min-w-[120px] rounded-xl border border-white/10 bg-ink-700 shadow-xl py-1 animate-scale-in origin-top-left">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] transition-colors ${
                value === opt
                  ? 'text-purple-300 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {optionIcons?.[opt]}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
