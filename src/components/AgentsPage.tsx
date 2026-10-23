import { Crown, Lock, Sparkles, Image, Video, Wand2, ExternalLink, Check } from 'lucide-react';
import { getCheckoutUrl } from '@/lib/config';

interface AgentsPageProps {
  isPremium: boolean;
}

interface AgentInfo {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  howItWorks: string;
  icon: typeof Sparkles;
  accent: string;
  badge: string;
}

const AGENTS: AgentInfo[] = [
  {
    id: 'diretor-criativo',
    name: 'Diretor Criativo\u2122',
    description:
      'Transforma ideias, referências e briefings em prompts cinematográficos profissionais para geração de imagens e vídeos com IA.',
    benefits: [
      'Transforma briefing simples em prompt cinematográfico completo',
      'Inclui direção de câmera, iluminação, mood e estilo visual',
      'Funciona para geração de imagens e vídeos com IA',
      'Reduz tentativa e erro — prompts prontos para usar',
    ],
    howItWorks:
      'Você envia uma ideia ou referência visual. O agente analisa o contexto e estrutura um prompt profissional com direção de cena, câmera, iluminação e estilo — pronto para colar em ferramentas como Veo, Sora, Kling ou Midjourney.',
    icon: Sparkles,
    accent: 'from-purple-500 to-pink-500',
    badge: 'PREMIUM',
  },
  {
    id: 'modelos-realistas',
    name: 'Modelos Realistas com I.A',
    description:
      'Analisa referências visuais e transforma características de rosto, pose, roupa, iluminação, câmera e ambiente em prompts estruturados para maior realismo e consistência de personagem.',
    benefits: [
      'Consistência de personagem entre múltiplas gerações',
      'Preserva rosto, roupa, iluminação e ambiente da referência',
      'Prompt estruturado com descrição técnica detalhada',
      'Maior realismo e fidelidade à referência original',
    ],
    howItWorks:
      'Você fornece uma imagem de referência. O agente extrai características de rosto, pose, vestuário, iluminação e ambiente, e estrutura um prompt que mantém a identidade visual consistente em novas gerações.',
    icon: Wand2,
    accent: 'from-blue-500 to-cyan-500',
    badge: 'PREMIUM',
  },
];

export function AgentsPage({ isPremium }: AgentsPageProps) {
  const checkoutUrl = getCheckoutUrl();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Agentes de IA</h2>
        <p className="mt-1 text-sm text-gray-500">
          Agentes especializados para elevar a qualidade das suas criações com IA.
        </p>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isLocked = !isPremium;

          return (
            <div
              key={agent.id}
              className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-ink-800/60 hover:border-purple-500/25 card-hover overflow-hidden"
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${agent.accent}`} />

              {/* Card body */}
              <div className="flex flex-col gap-4 p-5 sm:p-6">
                {/* Icon + name + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${agent.accent} glow-purple-soft`}
                    >
                      <Icon className="w-5.5 h-5.5 text-white" strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white leading-tight">{agent.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {agent.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-400 leading-relaxed">{agent.description}</p>

                {/* Benefits */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Benefícios</p>
                  <ul className="space-y-1.5">
                    {agent.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] text-gray-300 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How it works */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Como funciona</p>
                  <p className="text-[12px] text-gray-400 leading-relaxed">{agent.howItWorks}</p>
                </div>

                {/* Locked notice */}
                {isLocked && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span className="text-[12px] font-bold text-amber-300">Conteúdo Premium</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                      O conteúdo completo deste agente — incluindo instruções de uso, prompt-base e configuração —
                      está disponível para assinantes Premium do MotionLab.
                    </p>
                    {checkoutUrl ? (
                      <a
                        href={checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.02] transition-transform active:scale-95"
                      >
                        <Crown className="w-4 h-4" />
                        Desbloquear agente
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/25">
                        <Crown className="w-4 h-4" />
                        Desbloquear agente
                      </span>
                    )}
                  </div>
                )}

                {/* Premium unlocked placeholder */}
                {!isLocked && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Crown className="w-4 h-4 text-emerald-400" />
                      <span className="text-[12px] font-bold text-emerald-300">Agente desbloqueado</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      O conteúdo completo deste agente estará disponível em breve.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <Image className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Os agentes de IA são ferramentas especializadas que rodam externamente. O MotionLab fornece as
          instruções e prompts-base para você configurar e utilizar cada agente de forma autônoma.
        </p>
      </div>
    </div>
  );
}
