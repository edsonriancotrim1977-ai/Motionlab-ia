import { Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  prompt: { status: string };
  size?: 'sm' | 'md';
}

export function StatusBadge({ size = 'sm' }: StatusBadgeProps) {
  const padding = size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';
  const iconSize = size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 ${padding}`}
    >
      <Sparkles className={iconSize} />
      Compatível: Kling + Veo
    </span>
  );
}
