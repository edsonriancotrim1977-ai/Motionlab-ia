/*
# Insert two premium agent rows (metadata only — private content empty)

Inserts the two AI agents shown on the "Agentes de IA" page.
The public-facing fields (name, description, benefits, how_it_works) are
populated so the page can render them. The private fields
(full_instructions, installation_tutorial) are left empty — they will be
filled in a future migration when the complete agent content is provided.

## Rows inserted
1. slug: "diretor-criativo" — Diretor Criativo™
2. slug: "modelos-realistas" — Modelos Realistas com I.A

Both rows have premium = true and empty private content.
*/

INSERT INTO premium_agents (slug, name, description, benefits, how_it_works, full_instructions, installation_tutorial, premium)
VALUES
  (
    'diretor-criativo',
    'Diretor Criativo™',
    'Transforma ideias, referências e briefings em prompts cinematográficos profissionais para geração de imagens e vídeos com IA.',
    '[
      "Transforma briefing simples em prompt cinematográfico completo",
      "Inclui direção de câmera, iluminação, mood e estilo visual",
      "Funciona para geração de imagens e vídeos com IA",
      "Reduz tentativa e erro — prompts prontos para usar"
    ]'::jsonb,
    'Você envia uma ideia ou referência visual. O agente analisa o contexto e estrutura um prompt profissional com direção de cena, câmera, iluminação e estilo — pronto para colar em ferramentas como Veo, Sora, Kling ou Midjourney.',
    '',
    '',
    true
  ),
  (
    'modelos-realistas',
    'Modelos Realistas com I.A',
    'Analisa referências visuais e transforma características de rosto, pose, roupa, iluminação, câmera e ambiente em prompts estruturados para maior realismo e consistência de personagem.',
    '[
      "Consistência de personagem entre múltiplas gerações",
      "Preserva rosto, roupa, iluminação e ambiente da referência",
      "Prompt estruturado com descrição técnica detalhada",
      "Maior realismo e fidelidade à referência original"
    ]'::jsonb,
    'Você fornece uma imagem de referência. O agente extrai características de rosto, pose, vestuário, iluminação e ambiente, e estrutura um prompt que mantém a identidade visual consistente em novas gerações.',
    '',
    '',
    true
  )
ON CONFLICT (slug) DO NOTHING;
