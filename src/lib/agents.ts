import { supabase } from './supabase';

export interface AgentContent {
  full_instructions: string;
  installation_tutorial: string;
}

export async function fetchAgentContent(slug: string): Promise<AgentContent | null> {
  const { data, error } = await supabase.rpc('get_premium_agent', {
    agent_slug: slug,
  });
  if (error) {
    console.error('Error fetching agent content:', error);
    return null;
  }
  if (!data || (Array.isArray(data) && data.length === 0)) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    full_instructions: row.full_instructions,
    installation_tutorial: row.installation_tutorial,
  };
}
