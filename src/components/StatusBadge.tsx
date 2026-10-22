import { Check, Clock } from 'lucide-react';
import type { Prompt } from '@/types';

interface StatusBadgeProps {
  prompt: Prompt;
  size?: 'sm' | 'md';
}

export function StatusBadge({ prompt, size = 'sm' }: StatusBadgeProps) {
  const isTested = prompt.status === 'Testado';
  const padding = size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';
  const iconSize = size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5';

  if (isTested) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 ${padding}`}
      >
        <Check className={iconSize} />
        {prompt.testedModel ? `Testado: ${prompt.testedModel}` : 'Testado'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-semibold bg-white/8 text-gray-400 border border-white/10 ${padding}`}
    >
      <Clock className={iconSize} />
      A testar
    </span>
  );
}
