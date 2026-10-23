import { supabase } from './supabase';

export async function loadDbFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('prompt_id')
    .eq('user_id', userId);
  if (error) return [];
  return (data ?? []).map((r) => r.prompt_id);
}

export async function migrateLocalFavorites(userId: string, localIds: string[]): Promise<void> {
  if (localIds.length === 0) return;
  const existing = await loadDbFavorites(userId);
  const toInsert = localIds.filter((id) => !existing.includes(id));
  if (toInsert.length === 0) return;
  await supabase.from('favorites').insert(
    toInsert.map((prompt_id) => ({ user_id: userId, prompt_id })),
  );
}

export async function addDbFavorite(userId: string, promptId: string): Promise<void> {
  await supabase.from('favorites').insert({ user_id: userId, prompt_id: promptId });
}

export async function removeDbFavorite(userId: string, promptId: string): Promise<void> {
  await supabase.from('favorites').delete().eq('user_id', userId).eq('prompt_id', promptId);
}
