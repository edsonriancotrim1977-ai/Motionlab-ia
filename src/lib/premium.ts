import { supabase } from './supabase';

export interface PremiumPromptContent {
  prompt_text: string;
  take_prompts: Array<{
    take: number;
    duration: string;
    title: string;
    prompt: string;
  }> | null;
}

export async function fetchPremiumPrompt(promptId: string): Promise<PremiumPromptContent | null> {
  const { data, error } = await supabase.rpc('get_premium_prompt', {
    prompt_id_text: promptId,
  });
  if (error) {
    console.error('Error fetching premium prompt:', error);
    return null;
  }
  if (!data || (Array.isArray(data) && data.length === 0)) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    prompt_text: row.prompt_text,
    take_prompts: row.take_prompts,
  };
}
