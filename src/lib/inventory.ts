// L'inventaire reste un simple texte (une ligne par objet) pour ne pas toucher la base.
// Une ligne qui commence par « * » est un objet porté ou tenu en main.

export type Item = { text: string; equipped: boolean };

const EQUIPPED = /^\*\s*/;

export function parseInventory(inventory: string): Item[] {
  return inventory
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ text: line.replace(EQUIPPED, ''), equipped: EQUIPPED.test(line) }));
}

export function serializeInventory(items: Item[]): string {
  return items
    .filter((i) => i.text.trim())
    .map((i) => (i.equipped ? `* ${i.text.trim()}` : i.text.trim()))
    .join('\n');
}

export const equippedItems = (inventory: string) => parseInventory(inventory).filter((i) => i.equipped);
