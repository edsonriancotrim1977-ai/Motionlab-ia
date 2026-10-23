import type { Category } from './types';

export interface CategoryStyle {
  gradient: string;
  glow: string;
}

export const categoryStyles: Record<string, CategoryStyle> = {
  'ganchos-virais': { gradient: 'from-orange-500/20 via-red-500/10 to-purple-500/10', glow: 'rgba(249,115,22,0.15)' },
  'ugc-vendas': { gradient: 'from-blue-500/20 via-cyan-500/10 to-purple-500/10', glow: 'rgba(59,130,246,0.15)' },
  'cta': { gradient: 'from-purple-500/20 via-fuchsia-500/10 to-pink-500/10', glow: 'rgba(168,85,247,0.15)' },
  'selfie-espelho': { gradient: 'from-pink-500/20 via-rose-500/10 to-purple-500/10', glow: 'rgba(236,72,153,0.15)' },
  'moda-looks': { gradient: 'from-fuchsia-500/20 via-pink-500/10 to-violet-500/10', glow: 'rgba(217,70,239,0.15)' },
  'produto-ecommerce': { gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/10', glow: 'rgba(16,185,129,0.15)' },
  'movimentos-corporais': { gradient: 'from-violet-500/20 via-purple-500/10 to-indigo-500/10', glow: 'rgba(139,92,246,0.15)' },
  'movimentos-camera': { gradient: 'from-indigo-500/20 via-blue-500/10 to-purple-500/10', glow: 'rgba(99,102,241,0.15)' },
  'pov': { gradient: 'from-cyan-500/20 via-blue-500/10 to-violet-500/10', glow: 'rgba(34,211,238,0.15)' },
  'transicoes': { gradient: 'from-amber-500/20 via-orange-500/10 to-pink-500/10', glow: 'rgba(245,158,11,0.15)' },
  'consistencia-personagem': { gradient: 'from-green-500/20 via-emerald-500/10 to-cyan-500/10', glow: 'rgba(34,197,94,0.15)' },
  'correcoes-realismo': { gradient: 'from-slate-400/20 via-gray-400/10 to-purple-500/10', glow: 'rgba(148,163,184,0.15)' },
  'casa-organizacao': { gradient: 'from-teal-500/20 via-emerald-500/10 to-cyan-500/10', glow: 'rgba(20,184,166,0.15)' },
  'imagens': { gradient: 'from-rose-500/20 via-pink-500/10 to-fuchsia-500/10', glow: 'rgba(244,63,94,0.15)' },
  'no-face': { gradient: 'from-slate-500/20 via-gray-500/10 to-zinc-500/10', glow: 'rgba(100,116,139,0.15)' },
  'feminino': { gradient: 'from-pink-500/20 via-rose-500/10 to-orange-500/10', glow: 'rgba(236,72,153,0.15)' },
  'ugc': { gradient: 'from-sky-500/20 via-blue-500/10 to-cyan-500/10', glow: 'rgba(14,165,233,0.15)' },
  'masculino': { gradient: 'from-blue-600/20 via-slate-500/10 to-gray-600/10', glow: 'rgba(37,99,235,0.15)' },
  'dinamicos': { gradient: 'from-red-500/20 via-orange-500/10 to-amber-500/10', glow: 'rgba(239,68,68,0.15)' },
  'make-joias-bolsas': { gradient: 'from-amber-500/20 via-yellow-500/10 to-orange-400/10', glow: 'rgba(245,158,11,0.15)' },
  'lancamentos': { gradient: 'from-rose-500/20 via-red-500/10 to-orange-500/10', glow: 'rgba(244,63,94,0.18)' },
};

export const categories: Category[] = [
  { id: 'ganchos-virais', label: 'Ganchos Virais', icon: '🔥' },
  { id: 'ugc-vendas', label: 'UGC & Vendas', icon: '🎥' },
  { id: 'cta', label: 'CTA', icon: '👇' },
  { id: 'selfie-espelho', label: 'Selfie & Espelho', icon: '🪞' },
  { id: 'moda-looks', label: 'Moda & Looks', icon: '👗' },
  { id: 'produto-ecommerce', label: 'Produto & E-commerce', icon: '🛍' },
  { id: 'movimentos-corporais', label: 'Movimentos Corporais', icon: '🚶' },
  { id: 'movimentos-camera', label: 'Movimentos de Câmera', icon: '🎬' },
  { id: 'pov', label: 'POV', icon: '👁' },
  { id: 'transicoes', label: 'Transições', icon: '✨' },
  { id: 'consistencia-personagem', label: 'Consistência de Personagem', icon: '🧍' },
  { id: 'correcoes-realismo', label: 'Correções & Realismo', icon: '🛠' },
  { id: 'casa-organizacao', label: 'Casa & Organização', icon: '🏠' },
  { id: 'imagens', label: 'Imagens', icon: '🖼' },
  { id: 'no-face', label: 'No Face', icon: '🫥' },
  { id: 'feminino', label: 'Feminino', icon: '💃' },
  { id: 'ugc', label: 'UGC', icon: '📱' },
  { id: 'masculino', label: 'Masculino', icon: '🕺' },
  { id: 'dinamicos', label: 'Dinâmicos', icon: '⚡' },
  { id: 'make-joias-bolsas', label: 'Make/Jóias/Bolsas', icon: '💎' },
  { id: 'lancamentos', label: 'Lançamentos', icon: '🚀' },
];

export const categoryMap = categories.reduce<Record<string, Category>>((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export function getCategoryStyle(categoryId: string): CategoryStyle {
  return categoryStyles[categoryId] ?? { gradient: 'from-purple-500/20 to-pink-500/10', glow: 'rgba(168,85,247,0.15)' };
}
