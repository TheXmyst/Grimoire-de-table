import { classResources } from './conditions';
import type { Pregen } from './pregens';
import { supabase } from './supabase';

/** Crée la fiche d'un personnage prétiré dans une campagne, avec ses sorts du DRS. */
export async function importPregen(campaignId: string, p: Pregen): Promise<string> {
  const { spells, ...fields } = p;
  const insert = (row: object) => supabase.from('characters').insert(row).select('id').single();
  let { data, error } = await insert({ ...fields, campaign_id: campaignId, resources: classResources(p.class, p.level, p.abilities) });
  // Base sans la migration 0005 : on crée la fiche sans les ressources
  if (error && error.message.includes('resources')) ({ data, error } = await insert({ ...fields, campaign_id: campaignId }));
  if (error || !data) throw error ?? new Error('Création impossible');

  if (spells.length > 0) {
    const { data: found, error: e2 } = await supabase
      .from('spells')
      .select('id, name')
      .is('campaign_id', null)
      .in('name', spells.map((s) => s.name));
    if (e2) throw e2;
    const idByName = new Map((found ?? []).map((s) => [s.name as string, s.id as string]));
    const rows = spells
      .filter((s) => idByName.has(s.name))
      .map((s) => ({ character_id: data.id, spell_id: idByName.get(s.name), tag: s.tag, prepared: s.prepared, status: 'approved' }));
    if (rows.length > 0) {
      const { error: e3 } = await supabase.from('character_spells').insert(rows);
      if (e3) throw e3;
    }
  }
  return data.id as string;
}
