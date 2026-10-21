// L'inventaire reste un simple texte (une ligne par objet) pour ne pas toucher la base.
// Une ligne qui commence par « * » est un objet porté ou tenu en main.
// Une quantité s'écrit à la fin : « Ration ×5 », « Fléchettes (×10) » ou « Torche x3 ».

export type Item = { text: string; equipped: boolean; qty: number };

const EQUIPPED = /^\*\s*/;
const QTY = /\s*(?:\(\s*[x×]\s*(\d+)\s*\)|[x×]\s*(\d+))$/i;

function splitQty(line: string): { text: string; qty: number } {
  const m = line.match(QTY);
  if (!m || m.index === 0) return { text: line, qty: 1 };
  return { text: line.slice(0, m.index).trim(), qty: Math.max(1, parseInt(m[1] ?? m[2], 10)) };
}

export function parseInventory(inventory: string): Item[] {
  return inventory
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ ...splitQty(line.replace(EQUIPPED, '')), equipped: EQUIPPED.test(line) }));
}

export const itemLabel = (i: Pick<Item, 'text' | 'qty'>) => (i.qty > 1 ? `${i.text.trim()} ×${i.qty}` : i.text.trim());

export function serializeInventory(items: Item[]): string {
  return items
    .filter((i) => i.text.trim())
    .map((i) => (i.equipped ? `* ${itemLabel(i)}` : itemLabel(i)))
    .join('\n');
}

export const equippedItems = (inventory: string) => parseInventory(inventory).filter((i) => i.equipped);
