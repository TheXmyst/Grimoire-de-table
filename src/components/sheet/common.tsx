import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Campaign, Character, CharacterSpell } from '../../lib/types';
import { fonts, useTheme } from '../../lib/theme';
import { Field, Label } from '../ui';

/** Ce que chaque onglet de la fiche reçoit. */
export type SheetProps = {
  ch: Character;
  campaign: Campaign;
  spells: CharacterSpell[];
  isGm: boolean;
  isOwner: boolean;
  canHp: boolean;
  canInventory: boolean;
  patch: (values: Partial<Character>) => Promise<void>;
  onRoll: (label: string, total: number, detail: string) => void;
  reloadSpells: () => void;
};

export function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  const t = useTheme();
  return (
    <View style={[styles.stat, { borderColor: highlight ? t.brass : t.line, backgroundColor: t.bg }]}>
      <Label>{label}</Label>
      <Text style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: '700', color: highlight ? t.brass : t.ink }}>
        {value}
      </Text>
    </View>
  );
}

export function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexBasis: 90, flexGrow: 1 }}>
      <Field label={label} value={String(value)} keyboardType="number-pad" onChangeText={(v) => onChange(parseInt(v, 10) || 0)} />
    </View>
  );
}

/** Zone de texte enregistrée quand on quitte le champ, et resynchronisée si la fiche change ailleurs. */
export function TextArea({
  value,
  editable,
  onSave,
  placeholder,
  minHeight = 120,
}: {
  value: string;
  editable: boolean;
  onSave: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const t = useTheme();
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(value);
  }, [value, focused]);
  return (
    <TextInput
      multiline
      editable={editable}
      value={text}
      placeholder={editable ? placeholder : undefined}
      placeholderTextColor={t.muted}
      onChangeText={setText}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        if (text !== value) onSave(text);
      }}
      style={[styles.textarea, { minHeight, color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
    />
  );
}

/** Bloc repliable, avec un aperçu de la première ligne quand il est fermé. */
export function Collapsible({ title, preview, children }: { title: string; preview?: string; children: ReactNode }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.collapsible, { borderColor: t.line }]}>
      <Pressable accessibilityRole="button" onPress={() => setOpen(!open)} style={styles.collapsibleHead}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.ink, fontWeight: '700', fontSize: 16 }}>{title}</Text>
          {!open && preview ? (
            <Text numberOfLines={1} style={{ color: t.muted, fontSize: 14 }}>
              {preview}
            </Text>
          ) : null}
        </View>
        <Text style={{ color: t.muted, fontSize: 18 }}>{open ? '−' : '+'}</Text>
      </Pressable>
      {open && <View style={{ paddingBottom: 12 }}>{children}</View>}
    </View>
  );
}

/** Pastille de maîtrise : vide, maîtrise (pleine) ou expertise (double anneau). */
export function ProfDot({ level }: { level: 0 | 1 | 2 }) {
  const t = useTheme();
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: level === 2 ? 4 : 2,
        borderColor: level ? t.accent : t.line,
        backgroundColor: level === 1 ? t.accent : 'transparent',
      }}
    />
  );
}

export function Tabs<K extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  const t = useTheme();
  return (
    <View style={[styles.tabs, { borderColor: t.line }]}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, { borderColor: active ? t.accent : 'transparent' }]}
          >
            <Text style={{ fontFamily: fonts.display, fontWeight: '700', fontSize: 16, color: active ? t.ink : t.muted }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const sheetStyles = StyleSheet.create({
  line: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth },
  value: { fontFamily: fonts.display, fontSize: 18, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  columns: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  column: { flexGrow: 1, flexBasis: 300 },
});

const styles = StyleSheet.create({
  stat: { flex: 1, minWidth: 72, borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center', gap: 2 },
  textarea: { borderWidth: 1, borderRadius: 6, padding: 10, fontSize: 16, textAlignVertical: 'top' },
  collapsible: { borderBottomWidth: 1 },
  collapsibleHead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, flexWrap: 'wrap' },
  tab: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 3 },
});
