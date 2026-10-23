import { readFileSync, writeFileSync } from 'fs';

const libraryData = JSON.parse(readFileSync('src/data/motionlab-library.json', 'utf-8'));
const importBatchData = JSON.parse(readFileSync('src/data/import-batch.json', 'utf-8'));
const recoveredMediaData = JSON.parse(readFileSync('src/data/recovered-media.json', 'utf-8'));
const newBatchData = JSON.parse(readFileSync('src/data/motionlab_import_batch_30.json', 'utf-8'));
const novoLoteData = JSON.parse(readFileSync('src/data/motionlab_novo_lote.json', 'utf-8'));

const FREE_IDS = new Set([
  'SELFIE-01',
  'LANCAMENTO-002',
  'LANCAMENTO-003',
  'LANCAMENTO-007',
  'LANCAMENTO-008',
  'UNBOXING-001',
  'ML-NEW-012-caminhao-com-mercadoria',
]);

const CLOUD_NAME = 'rnfilyy9';
function videoUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}.mp4`;
}
function playerUrl(publicId: string): string {
  return `https://player.cloudinary.com/embed/?cloud_name=${CLOUD_NAME}&public_id=${publicId}`;
}

// Merge logic from prompts.ts
const mergedMap = new Map<string, any>();
for (const item of libraryData) mergedMap.set(item.id, item);
for (const item of importBatchData) mergedMap.set(item.id, item);

// Recovered media matching
const mediaMatches: Array<{ promptId: string; publicIds: string[] }> = [
  { promptId: 'CTA-01', publicIds: ['midia_14', 'midia_40', 'midia_96'] },
  { promptId: 'CTA-003', publicIds: ['midia_23', 'midia_57'] },
  { promptId: 'CTA-002', publicIds: ['midia_89'] },
  { promptId: 'UGC-MODA-001', publicIds: ['midia_27'] },
  { promptId: 'MODA-BLAZER-002', publicIds: ['midia_27'] },
  { promptId: 'UGC-MODA-002', publicIds: ['midia_28'] },
  { promptId: 'MODA-TOP-002', publicIds: ['midia_28'] },
  { promptId: 'UGC-MODA-003', publicIds: ['midia_29'] },
  { promptId: 'MODA-LEGGING-002', publicIds: ['midia_29'] },
  { promptId: 'MODA-VESTIDO-001', publicIds: ['midia_15', 'midia_24'] },
  { promptId: 'MODA-SAIA-001', publicIds: ['midia_16'] },
  { promptId: 'MODA-LOOK-001', publicIds: ['midia_22'] },
  { promptId: 'SELFIE-01', publicIds: ['midia_22'] },
  { promptId: 'MODA-BODY-001', publicIds: ['midia_26'] },
  { promptId: 'SELFIE-LOOK-002', publicIds: ['midia_18', 'midia_17_-_Trim'] },
  { promptId: 'SELFIE-POSE-003', publicIds: ['midia_19'] },
  { promptId: 'UGC-PRODUTO-001', publicIds: ['midia_2', 'midia_12', 'midia_33', 'midia_34', 'midia_71', 'midia_72'] },
  { promptId: 'TRANSICAO-01', publicIds: ['midia_94', 'midia_95'] },
  { promptId: 'TRANSICAO-002', publicIds: ['midia_88'] },
  { promptId: 'UNBOXING-001', publicIds: ['midia_73', 'midia_74'] },
  { promptId: 'UNBOXING-002', publicIds: ['midia_97'] },
  { promptId: 'POV-001', publicIds: ['midia_54'] },
  { promptId: 'UGC-BEAUTY-001', publicIds: ['midia_82'] },
  { promptId: 'UGC-BEAUTY-002', publicIds: ['midia_81'] },
  { promptId: 'CORPO-01', publicIds: ['midia_31', 'midia_66'] },
  { promptId: 'CAMERA-01', publicIds: ['midia_70'] },
  { promptId: 'CORPO-01', publicIds: ['midia_9'] },
];

const assignedPublicIds = new Set<string>();
for (const m of mediaMatches) for (const pid of m.publicIds) assignedPublicIds.add(pid);

// Generate REC cards
function normalizeText(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const newCards: any[] = [];
let newCardCounter = 1;
for (const media of recoveredMediaData) {
  if (!media.title.trim()) continue;
  if (assignedPublicIds.has(media.publicId)) continue;
  const id = `REC-${String(newCardCounter).padStart(3, '0')}`;
  newCardCounter++;
  newCards.push({
    id,
    title: media.title,
    prompt: `REC generated prompt for ${media.title}`,
    mediaUrl: videoUrl(media.publicId),
    cloudinaryPlayerUrl: playerUrl(media.publicId),
    publicId: media.publicId,
  });
}
for (const card of newCards) {
  if (!mergedMap.has(card.id)) mergedMap.set(card.id, card);
}

// Apply media matches
const promptIdToMedia = new Map<string, { primary: string; additional: string[] }>();
for (const m of mediaMatches) {
  const existing = promptIdToMedia.get(m.promptId);
  if (existing) {
    for (const pid of m.publicIds) {
      if (!existing.additional.includes(pid) && pid !== existing.primary) existing.additional.push(pid);
    }
  } else {
    const [primary, ...rest] = m.publicIds;
    promptIdToMedia.set(m.promptId, { primary, additional: rest });
  }
}

for (const [promptId, media] of promptIdToMedia) {
  const existing = mergedMap.get(promptId);
  if (!existing) continue;
  if (!existing.mediaUrl) {
    existing.mediaUrl = videoUrl(media.primary);
    existing.cloudinaryPlayerUrl = playerUrl(media.primary);
    existing.publicId = media.primary;
  }
}

// Merge new batch
const existingMediaUrls = new Set<string>();
for (const [, item] of mergedMap) {
  if (item.mediaUrl) existingMediaUrls.add(item.mediaUrl);
  if (item.cloudinaryPlayerUrl) existingMediaUrls.add(item.cloudinaryPlayerUrl);
}

for (const item of newBatchData.items || []) {
  if (mergedMap.has(item.id)) continue;
  const mediaUrl = String(item.mediaUrl || '');
  if (mediaUrl && existingMediaUrls.has(mediaUrl)) continue;
  const processed = { ...item };
  if (mediaUrl && mediaUrl.includes('player.cloudinary.com/embed/')) {
    processed.cloudinaryPlayerUrl = mediaUrl;
    const pidMatch = mediaUrl.match(/public_id=([^&]+)/);
    if (pidMatch) processed.publicId = decodeURIComponent(pidMatch[1]);
    if (processed.publicId) processed.mediaUrl = videoUrl(processed.publicId);
  }
  if (mediaUrl) existingMediaUrls.add(mediaUrl);
  mergedMap.set(item.id, processed);
}

for (const item of novoLoteData.items || []) {
  if (mergedMap.has(item.id)) continue;
  const mediaUrl = String(item.mediaUrl || '');
  if (mediaUrl && existingMediaUrls.has(mediaUrl)) continue;
  const processed = { ...item };
  if (mediaUrl && mediaUrl.includes('player.cloudinary.com/embed/')) {
    processed.cloudinaryPlayerUrl = mediaUrl;
    const pidMatch = mediaUrl.match(/public_id=([^&]+)/);
    if (pidMatch) processed.publicId = decodeURIComponent(pidMatch[1]);
    if (processed.publicId) processed.mediaUrl = videoUrl(processed.publicId);
  }
  if (mediaUrl) existingMediaUrls.add(mediaUrl);
  mergedMap.set(item.id, processed);
}

// Filter to only cards with Cloudinary media (same as prompts.ts)
function hasMedia(item: any): boolean {
  const url = item.mediaUrl || '';
  const hasCloudinaryVideo = url.includes('res.cloudinary.com/') && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
  const hasCloudinaryImage = url.includes('res.cloudinary.com/') && url.includes('/image/upload/');
  const hasPlayer = !!item.cloudinaryPlayerUrl;
  return hasCloudinaryVideo || hasCloudinaryImage || hasPlayer;
}

// Collect paid items
const paidItems: any[] = [];
for (const [id, item] of mergedMap) {
  if (FREE_IDS.has(id)) continue;
  if (!hasMedia(item)) continue;
  if (!item.prompt) continue;
  paidItems.push(item);
}

// Generate SQL
function sqlEscape(s: string): string {
  return s.replace(/'/g, "''");
}

let sql = '-- Populate premium_prompts table with all paid prompt content\n';
sql += '-- Generated from static JSON data files\n\n';
sql += 'INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)\nVALUES\n';

const values: string[] = [];
for (const item of paidItems) {
  const promptId = sqlEscape(item.id);
  const promptText = sqlEscape(item.prompt || '');
  let takePromptsSql = 'NULL';
  if (item.takePrompts && Array.isArray(item.takePrompts) && item.takePrompts.length > 0) {
    const jsonStr = JSON.stringify(item.takePrompts).replace(/'/g, "''");
    takePromptsSql = `'${jsonStr}'::jsonb`;
  }
  values.push(`  ('${promptId}', '${promptText}', ${takePromptsSql})`);
}

sql += values.join(',\n');
sql += '\nON CONFLICT (prompt_id) DO UPDATE SET\n  prompt_text = EXCLUDED.prompt_text,\n  take_prompts = EXCLUDED.take_prompts;\n';

writeFileSync('scripts/premium-insert.sql', sql);
console.log(`Generated SQL for ${paidItems.length} paid prompts`);
console.log('Paid IDs:', paidItems.map(p => p.id).join(', '));
