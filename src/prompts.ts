import type { Prompt, PromptType } from './types';
import { categories } from './categories';
import libraryData from './data/motionlab-library.json';
import importBatchData from './data/import-batch.json';
import recoveredMediaData from './data/recovered-media.json';
import newBatchData from './data/motionlab_import_batch_30.json';

type RawPrompt = Record<string, unknown> & {
  id: string;
  title: string;
  category: string;
  description: string;
  type?: string;
  duration?: string;
  format?: string;
  status?: string;
  testedModel?: string;
  prompt: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaStatus?: string;
  tags?: string[];
  tips?: string;
  avoid?: string[] | string;
  usageTip?: string;
  avoidList?: string[];
  cloudinaryPlayerUrl?: string;
  publicId?: string;
  additionalMediaUrls?: string[];
};

interface RecoveredMedia {
  publicId: string;
  title: string;
}

const CLOUD_NAME = 'rnfilyy9';

function videoUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}.mp4`;
}

function playerUrl(publicId: string): string {
  return `https://player.cloudinary.com/embed/?cloud_name=${CLOUD_NAME}&public_id=${publicId}`;
}

// Map category labels (e.g. "Moda & Looks") to IDs (e.g. "moda-looks")
const labelToId = new Map<string, string>();
for (const cat of categories) {
  labelToId.set(cat.label.toLowerCase(), cat.id);
}
// Extra mappings for label variants used in imported batches
labelToId.set('selfie espelho', 'selfie-espelho');
labelToId.set('make/jóias/bolsas', 'make-joias-bolsas');
labelToId.set('make/joias/bolsas', 'make-joias-bolsas');

const typeMap: Record<string, PromptType> = {
  video: 'Vídeo',
  image: 'Imagem',
  ugc: 'UGC',
  'vídeo': 'Vídeo',
  'imagem': 'Imagem',
};

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(raw: RawPrompt): Prompt {
  let category = raw.category;
  const lowerCat = String(category).toLowerCase();
  if (!categories.some((c) => c.id === category)) {
    category = labelToId.get(lowerCat) ?? category;
  }

  const rawType = String(raw.type ?? 'video').toLowerCase();
  const type: PromptType = typeMap[rawType] ?? 'Vídeo';

  const usageTip = raw.usageTip || raw.tips || undefined;
  const avoidList = raw.avoidList
    ?? (raw.avoid ? (Array.isArray(raw.avoid) ? raw.avoid : [raw.avoid]) : undefined);

  const mediaType = raw.mediaType === 'image' || type === 'Imagem' ? 'image' : 'video';

  const mediaUrl = raw.mediaUrl || undefined;
  const mediaStatus = mediaUrl ? 'available' : ((raw.mediaStatus === 'available' ? 'available' : 'placeholder') as Prompt['mediaStatus']);

  return {
    id: raw.id,
    title: raw.title,
    category,
    description: raw.description,
    type,
    duration: raw.duration || '',
    format: (raw.format || '9:16') as Prompt['format'],
    status: (raw.status === 'Testado' ? 'Testado' : 'A testar') as Prompt['status'],
    testedModel: raw.testedModel || undefined,
    prompt: raw.prompt,
    mediaType: mediaType as Prompt['mediaType'],
    mediaUrl,
    thumbnailUrl: raw.thumbnailUrl || undefined,
    mediaStatus,
    cloudinaryPlayerUrl: raw.cloudinaryPlayerUrl || undefined,
    publicId: raw.publicId || undefined,
    additionalMediaUrls: raw.additionalMediaUrls,
    tags: raw.tags ?? [],
    usageTip,
    avoidList,
  };
}

// --- Recovered media matching ---

const recoveredMedia = recoveredMediaData as RecoveredMedia[];

// Title-based matching: map normalized recovered-media title keywords to existing prompt IDs
// Each entry: [matched prompt ID, [list of publicIds that match it]]
const mediaMatches: Array<{ promptId: string; publicIds: string[] }> = [
  // CTA — Apontar para baixo matches CTA-01 and CTA-003
  { promptId: 'CTA-01', publicIds: ['midia_14', 'midia_40', 'midia_96'] },
  { promptId: 'CTA-003', publicIds: ['midia_23', 'midia_57'] },
  // CTA — Chamar e apontar matches CTA-002
  { promptId: 'CTA-002', publicIds: ['midia_89'] },
  // Blazer matches
  { promptId: 'UGC-MODA-001', publicIds: ['midia_27'] },
  { promptId: 'MODA-BLAZER-002', publicIds: ['midia_27'] },
  // Top / Look Academia matches
  { promptId: 'UGC-MODA-002', publicIds: ['midia_28'] },
  { promptId: 'MODA-TOP-002', publicIds: ['midia_28'] },
  // Legging matches
  { promptId: 'UGC-MODA-003', publicIds: ['midia_29'] },
  { promptId: 'MODA-LEGGING-002', publicIds: ['midia_29'] },
  // Vestido / Saia matches
  { promptId: 'MODA-VESTIDO-001', publicIds: ['midia_15', 'midia_24'] },
  { promptId: 'MODA-SAIA-001', publicIds: ['midia_16'] },
  // Mostrando Look / Mostrar look completo
  { promptId: 'MODA-LOOK-001', publicIds: ['midia_22'] },
  { promptId: 'SELFIE-01', publicIds: ['midia_22'] },
  // Body
  { promptId: 'MODA-BODY-001', publicIds: ['midia_26'] },
  // Selfie Espelho animações
  { promptId: 'SELFIE-LOOK-002', publicIds: ['midia_18', 'midia_17_-_Trim'] },
  { promptId: 'SELFIE-POSE-003', publicIds: ['midia_19'] },
  // Detalhes do Produto / Mostrar o Produto
  { promptId: 'UGC-PRODUTO-001', publicIds: ['midia_2', 'midia_12', 'midia_33', 'midia_34', 'midia_71', 'midia_72'] },
  // Transição — Mão na lente / Tapar a câmera / Roupa na lente
  { promptId: 'TRANSICAO-01', publicIds: ['midia_94', 'midia_95'] },
  { promptId: 'TRANSICAO-002', publicIds: ['midia_88'] },
  // Unboxing
  { promptId: 'UNBOXING-001', publicIds: ['midia_73', 'midia_74'] },
  { promptId: 'UNBOXING-002', publicIds: ['midia_97'] },
  // POV
  { promptId: 'POV-001', publicIds: ['midia_54'] },
  // UGC Beauty — gloss
  { promptId: 'UGC-BEAUTY-001', publicIds: ['midia_82'] },
  { promptId: 'UGC-BEAUTY-002', publicIds: ['midia_81'] },
  // Movimentos Corporais — Aproximar e posar
  { promptId: 'CORPO-01', publicIds: ['midia_31', 'midia_66'] },
  // Camera push-in
  { promptId: 'CAMERA-01', publicIds: ['midia_70'] },
  // CTA-002 already matched above; also CTA-01
  // Mão na cintura -> Movimentos Corporais
  { promptId: 'CORPO-01', publicIds: ['midia_9'] },
];

// Build a map: publicId -> [promptIds that use it]
const publicIdToPromptIds = new Map<string, string[]>();
for (const m of mediaMatches) {
  for (const pid of m.publicIds) {
    const arr = publicIdToPromptIds.get(pid) ?? [];
    arr.push(m.promptId);
    publicIdToPromptIds.set(pid, arr);
  }
}

// Build a map: promptId -> primary publicId + additional publicIds
const promptIdToMedia = new Map<string, { primary: string; additional: string[] }>();
for (const m of mediaMatches) {
  const existing = promptIdToMedia.get(m.promptId);
  if (existing) {
    for (const pid of m.publicIds) {
      if (!existing.additional.includes(pid) && pid !== existing.primary) {
        existing.additional.push(pid);
      }
    }
  } else {
    const [primary, ...rest] = m.publicIds;
    promptIdToMedia.set(m.promptId, { primary, additional: rest });
  }
}

// --- New card generation for unmatched titled media ---

const existingPromptIds = new Set<string>();
const batchRaw = importBatchData as unknown as RawPrompt[];
const libraryRaw = libraryData as unknown as RawPrompt[];
for (const item of libraryRaw) existingPromptIds.add(item.id);
for (const item of batchRaw) existingPromptIds.add(item.id);

// Track which publicIds are already assigned to existing prompts
const assignedPublicIds = new Set<string>();
for (const m of mediaMatches) {
  for (const pid of m.publicIds) assignedPublicIds.add(pid);
}

// Categorization rules per spec
function categorizeByTitle(title: string): string {
  const t = normalizeText(title);
  if (t.includes('gancho')) return 'ganchos-virais';
  if (t.includes('cta')) return 'cta';
  if (t.includes('pov')) return 'pov';
  if (t.includes('selfie') || t.includes('espelho')) return 'selfie-espelho';
  if (t.includes('ugc')) return 'ugc-vendas';
  if (t.includes('unboxing') || t.includes('produto')) return 'produto-ecommerce';
  if (/(vestido|saia|look|blazer|legging|top|body|camiseta|roupa|peca|conjunto|short)/.test(t)) return 'moda-looks';
  if (/(cintura|cabelo|pose|costas|giro)/.test(t)) return 'movimentos-corporais';
  if (/(lente|transicao|tapar|tampar)/.test(t)) return 'transicoes';
  return 'movimentos-corporais';
}

function generatePromptText(title: string): string {
  const t = normalizeText(title);

  let movement = '';

  if (t.includes('cintura') && t.includes('rebolar')) {
    movement = 'A pessoa realiza um movimento suave e natural da cintura, mantendo os pes e o restante do corpo coerentes com a pose. O movimento deve parecer uma gravacao real de moda/UGC, sem exagero.';
  } else if (t.includes('cabelo') && t.includes('pisc')) {
    movement = 'A pessoa leva uma das maos naturalmente ate o cabelo, ajusta suavemente alguns fios, olha diretamente para a camera e da uma piscada natural e discreta. Retorna para uma pose relaxada.';
  } else if (t.includes('cabelo') && t.includes('mex')) {
    movement = 'A pessoa leva uma das maos naturalmente ate o cabelo e ajusta suavemente alguns fios. O movimento deve ser discreto e natural, como em uma gravacao real de selfie ou UGC. Retorna para a pose inicial.';
  } else if (t.includes('cabelo') && t.includes('amarr')) {
    movement = 'A pessoa leva as maos ate o cabelo e comeca a amarrar de forma natural, juntando os fios. O movimento das maos deve ser realista, com articulacao natural dos dedos e pulsos.';
  } else if (t.includes('cabelo') && t.includes('costas')) {
    movement = ' vista de costas, a pessoa leva uma das maos ao cabelo, ajusta fios suavemente e ao mesmo tempo ajusta o short ou peca inferior com a outra mao. Movimentos coordenados e naturais.';
  } else if (t.includes('costas') && t.includes('pose')) {
    movement = 'A pessoa, vista de costas, realiza uma mudanca sutil de pose, deslocando levemente o peso do corpo e ajustando a postura. O movimento deve ser discreto e natural.';
  } else if (t.includes('costas') && t.includes('masculino')) {
    movement = 'O personagem masculino, visto de costas, realiza um movimento sutil para demonstrar o caimento da peca. Pode ajustar levemente os ombros ou a gola.';
  } else if (t.includes('ombros') && t.includes('masculino')) {
    movement = 'O personagem masculino ajusta naturalmente os ombros, alinhando a peca vestida. O movimento deve destacar a estrutura e o caimento do conjunto nos ombros.';
  } else if (t.includes('masculino') && t.includes('conjunto')) {
    movement = 'O personagem masculino apresenta o conjunto vestido de forma natural, ajustando levemente a peca e mudando sutilmente a postura para mostrar o look completo.';
  } else if (t.includes('masculino') && t.includes('detalhes')) {
    movement = 'O personagem masculino destaca detalhes da peca vestida, ajustando a gola, alisando o tecido e mostrando acabamento de forma natural e proxima.';
  } else if (t.includes('masculino') && t.includes('produto') && t.includes('cta')) {
    movement = 'O personagem masculino mostra o produto de forma natural e em seguida faz um gesto sutil de CTA em direcao a parte inferior do enquadramento.';
  } else if (t.includes('masculino') && t.includes('no face') && t.includes('camiseta')) {
    movement = 'O personagem masculino apresenta a camiseta sem revelar o rosto, mantendo o celular cobrindo a face. Alisa o tecido, ajusta a gola e mostra a peca de frente e levemente de lado.';
  } else if (t.includes('olho') && t.includes('camera')) {
    movement = 'A pessoa olha diretamente para a camera de forma natural e confiante, com uma expressao sutil e relaxada. Pode fazer um leve ajuste na roupa ou na postura.';
  } else if (t.includes('mao') && t.includes('cintura')) {
    movement = 'A pessoa apoia naturalmente uma das maos na cintura, com um gesto suave e confiado. A postura deve parecer natural e relaxada, como em uma selfie ou gravacao UGC.';
  } else if (t.includes('caminhada') || t.includes('caminhar')) {
    movement = 'A pessoa da alguns passos curtos e casuais em direcao natural, mantendo a postura relaxada e o olhar coerente. O movimento deve parecer uma caminhada real, sem exagero.';
  } else if (t.includes('poses') && t.includes('aproximacao')) {
    movement = 'A pessoa comeca em uma pose natural, faz uma leve aproximacao em direcao a camera e termina em outra pose confiante. Movimento continuo e fluido.';
  } else if (t.includes('giro') && t.includes('modelo')) {
    movement = 'O modelo realiza um giro suave mostrando a frente e as laterais do look. O giro deve ser parcial, controlado, com fisica corporal coerente e sem exagero.';
  } else if (t.includes('zoom') && (t.includes('saia') || t.includes('calca'))) {
    movement = 'A camera faz uma aproximacao fisica lenta em direcao a regiao da saia ou calca, destacando o caimento, tecido e ajuste da peca sem usar zoom digital.';
  } else if (t.includes('demonstracao') && t.includes('dinamica') && t.includes('produto')) {
    movement = 'A pessoa realiza uma demonstracao dinamica do produto em uso, mostrando suas caracteristicas de forma natural e proxima. O movimento deve destacar o produto sem deformar sua aparencia.';
  } else if (t.includes('produto') && t.includes('uso') && t.includes('demonstracao')) {
    movement = 'A pessoa demonstra o produto em uso de forma natural, interagindo fisicamente com ele e mostrando sua funcao ou resultado de maneira realista.';
  } else if (t.includes('unboxing') && t.includes('uso')) {
    movement = 'As maos abrem a embalagem de forma realista e progressiva, retiram o produto e em seguida demonstram seu uso natural. O movimento deve ser continuo, sem teleportar objetos.';
  } else if (t.includes('unboxing') && t.includes('relogio')) {
    movement = 'As maos realizam o unboxing de um relogio de forma natural: abrem a embalagem, retiram o relogio e o apresentam proximo a camera. Movimentos realistas de agarra e manipulacao.';
  } else if (t.includes('unboxing') && t.includes('roupas')) {
    movement = 'As maos retiram pecas de roupa de uma embalagem de forma sequencial e realista. Cada peca deve viajar fisicamente da embalagem ate a area de apresentacao.';
  } else if (t.includes('pov') && t.includes('mostrar') && t.includes('produto') && t.includes('perto') && t.includes('blusa')) {
    movement = 'Em primeira pessoa, a camera se aproxima de uma blusa mostrando os detalhes do tecido, costuras e acabamento de forma natural e focada.';
  } else if (t.includes('pov') && t.includes('remover') && t.includes('roupa')) {
    movement = 'Em primeira pessoa, as maos removem pecas de roupa de uma superficie de forma natural, uma peca por vez, com movimentos realistas de agarra e deslocamento.';
  } else if (t.includes('pov') && t.includes('colocar') && t.includes('produto') && (t.includes('cama') || t.includes('bancada'))) {
    movement = 'Em primeira pessoa, as maos pegam o produto e o colocam naturalmente sobre uma cama ou bancada. O produto deve viajar fisicamente ate a superficie e repousar de forma realista.';
  } else if (t.includes('pov') && t.includes('esticar') && t.includes('produto')) {
    movement = 'Em primeira pessoa, as maos pegam o produto e esticam levemente o tecido para demonstrar elasticidade e qualidade. O tecido deve responder fisicamente e retornar ao estado natural.';
  } else if (t.includes('pov') && t.includes('passar') && t.includes('mao') && t.includes('produto')) {
    movement = 'Em primeira pessoa, uma das maos passa suavemente sobre o produto, deslizando os dedos pela superficie para demonstrar textura e acabamento.';
  } else if (t.includes('pov') && t.includes('retirar') && t.includes('produto')) {
    movement = 'Em primeira pessoa, as maos retiram o produto de uma superficie ou embalagem de forma natural, com agarra realista e deslocamento fisico do objeto.';
  } else if (t.includes('pov') && t.includes('tirando') && t.includes('produto') && t.includes('um por um')) {
    movement = 'Em primeira pessoa, as maos retiram produtos de uma embalagem ou superficie um por um, de forma sequencial e realista. Cada objeto deve viajar fisicamente.';
  } else if (t.includes('pov') && t.includes('dobrando') && t.includes('peca')) {
    movement = 'Em primeira pessoa, as maos dobram a peca de roupa de forma natural e precisa, mostrando o tecido respondendo ao movimento com fisica realista.';
  } else if (t.includes('pov') && t.includes('elasticidade') && t.includes('produto')) {
    movement = 'Em primeira pessoa, as maos esticam levemente o produto para demonstrar sua elasticidade. O tecido deve responder fisicamente e retornar ao estado original apos ser solto.';
  } else if (t.includes('pov') && t.includes('roteiro') && t.includes('fala')) {
    movement = 'Em primeira pessoa, a pessoa apresenta o produto ou cena com fala personalizavel. O movimento dos labios deve ser natural e coerente com o roteiro. Mantenha expressao facial consistente.';
  } else if (t.includes('pov') && t.includes('roupa') && t.includes('cabide')) {
    movement = 'Em primeira pessoa, as maos interagem com uma peca de roupa em um cabide, ajustando-a ou mostrando seus detalhes de forma natural.';
  } else if (t.includes('pov') && t.includes('troca') && t.includes('cores')) {
    movement = 'Em primeira pessoa, o produto troca de cor de forma natural, como se uma nova variacao fosse revelada. A transicao deve ser suave e preservar o design original do produto.';
  } else if (t.includes('pov') && t.includes('mostrando') && t.includes('peca')) {
    movement = 'Em primeira pessoa, a camera mostra a peca de roupa de perto, destacando tecido, costuras e acabamento com movimento natural e focado.';
  } else if (t.includes('cta') && t.includes('aproxima') && t.includes('aponta') && t.includes('encerra')) {
    movement = 'A pessoa se aproxima suavemente da camera, aponta em direcao a regiao inferior do enquadramento e encerra com uma pose relaxada. Movimento continuo e natural.';
  } else if (t.includes('cta') && t.includes('beijo')) {
    movement = 'A pessoa faz um gesto natural de beijo em direcao a camera, como um CTA afetuoso e discreto. O movimento deve ser sutil e natural, sem exagero.';
  } else if (t.includes('cta') && t.includes('dedo') && t.includes('baixo')) {
    movement = 'A pessoa usa o dedo indicador para apontar duas vezes em direcao a regiao inferior do enquadramento. O gesto deve ser controlado e natural.';
  } else if (t.includes('gancho') && t.includes('nao vou ficar')) {
    movement = 'A pessoa faz um gancho viral dizendo algo como "nao vou ficar assim, vem comigo" com expressao natural e gestos convincentes. Movimento corporal sutil, labios em sincronia com a fala.';
  } else if (t.includes('ugc') && t.includes('roteiro')) {
    movement = 'A pessoa apresenta um produto ou cena seguindo um roteiro UGC natural. A fala deve ser personalizavel e os labios devem estar em sincronia. Movimentos corporais discretos e naturais.';
  } else if (t.includes('ugc') && t.includes('aproxima') && t.includes('produto') && t.includes('chama')) {
    movement = 'A pessoa aproxima o produto da camera de forma natural e chama a atencao do espectador com um gesto sutil. O produto deve permanecer integro e legivel.';
  } else if (t.includes('ugc') && t.includes('gloss') && t.includes('aplicando')) {
    movement = 'A pessoa aplica o gloss labial de forma natural, levando o aplicador ate os labios com movimento controlado. Em seguida mostra o resultado de forma sutil.';
  } else if (t.includes('roupa') && t.includes('lente') && t.includes('transicao')) {
    movement = 'A peca de roupa se aproxima da camera ate cobrir completamente a lente, criando uma transicao natural. O movimento deve ser fisico e continuo, sem zoom digital.';
  } else if (t.includes('chama') && t.includes('aponta') && t.includes('sai')) {
    movement = 'A pessoa chama o espectador com um gesto natural, aponta para a regiao inferior e em seguida sai do enquadramento. Movimento sequencial e coordenado.';
  } else if (t.includes('chama') && t.includes('lente')) {
    movement = 'A pessoa faz um gesto de chamamento em direcao a camera, como se convidasse o espectador. O movimento deve ser natural e discreto.';
  } else if (t.includes('tapar') && t.includes('camera')) {
    movement = 'A mao livre se aproxima da camera de forma natural ate cobrir completamente a lente, criando uma transicao. O movimento deve ser continuo e controlado.';
  } else if (t.includes('detalhes') && t.includes('produto')) {
    movement = 'A pessoa ou as maos mostram os detalhes do produto de forma natural e proxima, destacando acabamento, textura e caracteristicas. Movimento focado e realista.';
  } else if (t.includes('mostra') && t.includes('produto')) {
    movement = 'A pessoa apresenta o produto de forma natural, segurando-o ou interagindo com ele para destacar suas caracteristicas principais.';
  } else if (t.includes('mostrar') && t.includes('produto') && t.includes('tecido')) {
    movement = 'A pessoa demonstra o tecido e o caimento do produto de forma natural, interagindo com o material para mostrar textura, fluxo e ajuste.';
  } else if (t.includes('demonstracao') && t.includes('dinamica')) {
    movement = 'A pessoa realiza uma demonstracao dinamica de um produto ou look, com movimentos naturais que destacam suas caracteristicas principais.';
  } else {
    movement = 'A pessoa realiza um movimento natural e sutil coerente com o titulo da cena, preservando a aparencia e o ambiente da referencia.';
  }

  return `Anime a imagem de referência preservando completamente a identidade da pessoa, rosto, cabelo, roupa, acessórios, produto e cenário.

MOVIMENTO:
${movement}

O movimento deve acontecer de forma natural, suave e realista, com física corporal coerente.

Preserve proporções corporais e anatomia.
Mantenha mãos e dedos naturais.
Não altere estampas, logos, tecidos ou características do produto.
Não troque a roupa.
Não adicione objetos.
Não altere o rosto.
Evite deformações, membros extras e movimentos bruscos.

Câmera estável e movimento cinematográfico natural.
Vídeo vertical 9:16.`;
}

// Generate new prompt records for unmatched titled media
const newCards: RawPrompt[] = [];
let newCardCounter = 1;

for (const media of recoveredMedia) {
  if (!media.title.trim()) continue;
  if (assignedPublicIds.has(media.publicId)) continue;

  const id = `REC-${String(newCardCounter).padStart(3, '0')}`;
  newCardCounter++;

  newCards.push({
    id,
    title: media.title,
    category: categorizeByTitle(media.title),
    description: media.title,
    type: 'video',
    duration: '5s',
    format: '9:16',
    status: 'A testar',
    testedModel: '',
    prompt: generatePromptText(media.title),
    mediaUrl: videoUrl(media.publicId),
    thumbnailUrl: '',
    cloudinaryPlayerUrl: playerUrl(media.publicId),
    publicId: media.publicId,
    tags: [normalizeText(media.title).split(' ')[0] || 'recuperado', 'ugc', 'video'],
    tips: '',
    avoid: '',
  });
}

// --- Merge everything ---

// Merge: import-batch takes priority over library for duplicate IDs
const mergedMap = new Map<string, RawPrompt>();
for (const item of libraryRaw) {
  mergedMap.set(item.id, item);
}
for (const item of batchRaw) {
  mergedMap.set(item.id, item);
}
// Add new cards from recovered media
for (const card of newCards) {
  if (!mergedMap.has(card.id)) {
    mergedMap.set(card.id, card);
  }
}

// Apply media matches to existing prompts
for (const [promptId, media] of promptIdToMedia) {
  const existing = mergedMap.get(promptId);
  if (!existing) continue;
  if (!existing.mediaUrl) {
    existing.mediaUrl = videoUrl(media.primary);
    existing.cloudinaryPlayerUrl = playerUrl(media.primary);
    existing.publicId = media.primary;
  } else {
    // Already has media; add as additional
    if (!existing.additionalMediaUrls) {
      existing.additionalMediaUrls = [];
    }
    if (!existing.additionalMediaUrls.includes(videoUrl(media.primary))) {
      existing.additionalMediaUrls.push(videoUrl(media.primary));
    }
  }
  // Add additional media
  if (!existing.additionalMediaUrls) existing.additionalMediaUrls = [];
  for (const pid of media.additional) {
    const vUrl = videoUrl(pid);
    if (!existing.additionalMediaUrls.includes(vUrl) && vUrl !== existing.mediaUrl) {
      existing.additionalMediaUrls.push(vUrl);
    }
  }
}

// --- Merge new batch (30 items) with deduplication ---

const newBatchRaw = (newBatchData as { items: RawPrompt[] }).items;

// Track existing mediaUrls to detect duplicates
const existingMediaUrls = new Set<string>();
for (const [, item] of mergedMap) {
  if (item.mediaUrl) existingMediaUrls.add(item.mediaUrl);
  if (item.cloudinaryPlayerUrl) existingMediaUrls.add(item.cloudinaryPlayerUrl);
}

let newBatchAdded = 0;
let newBatchDuplicates = 0;

for (const item of newBatchRaw) {
  // Dedupe by ID
  if (mergedMap.has(item.id)) {
    newBatchDuplicates++;
    continue;
  }
  // Dedupe by mediaUrl
  const mediaUrl = String(item.mediaUrl || '');
  if (mediaUrl && existingMediaUrls.has(mediaUrl)) {
    newBatchDuplicates++;
    continue;
  }

  // Cloudinary player URLs go into cloudinaryPlayerUrl for iframe rendering
  const processed: RawPrompt = { ...item };
  if (mediaUrl && mediaUrl.includes('player.cloudinary.com/embed/')) {
    processed.cloudinaryPlayerUrl = mediaUrl;
    // Extract public_id from the player URL
    const pidMatch = mediaUrl.match(/public_id=([^&]+)/);
    if (pidMatch) processed.publicId = decodeURIComponent(pidMatch[1]);
    // Set mediaUrl to the direct video URL so isVideoUrl detects it
    if (processed.publicId) {
      processed.mediaUrl = videoUrl(processed.publicId);
    }
  }

  // Cloudinary image URLs stay as-is in mediaUrl (rendered as <img>)

  if (mediaUrl) existingMediaUrls.add(mediaUrl);

  mergedMap.set(item.id, processed);
  newBatchAdded++;
}

export const prompts: Prompt[] = Array.from(mergedMap.values()).map(normalize);

export const newBatchStats = { found: newBatchRaw.length, added: newBatchAdded, duplicates: newBatchDuplicates };
