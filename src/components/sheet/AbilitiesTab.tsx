import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ABILITIES, SKILLS, modifier, proficiencyBonus, signed } from '../../lib/rules';
import { fonts, useTheme } from '../../lib/theme';
import { Body, Card, Label, Title } from '../ui';
import { ProfDot, sheetStyles, type SheetProps } from './common';

export function skillTotal(ch: SheetProps['ch'], key: string) {
  const skill = SKILLS.find((s) => s.key === key)!;
  const pb = proficiencyBonus(ch.level);
  const mult = ch.skill_expertise.includes(key) ? 2 : ch.skill_profs.includes(key) ? 1 : 0;
  return modifier(ch.abilities[skill.ability]) + pb * mult;
}

export function AbilitiesTab({ ch, isGm, patch, onRoll }: SheetProps) {
  const t = useTheme();
  const pb = proficiencyBonus(ch.level);
  const d20 = () => 1 + Math.floor(Math.random() * 20);

  function roll(label: string, bonus: number) {
    const r = d20();
    onRoll(label, r + bonus, `d20 (${r}) ${signed(bonus)}`);
  }

  function toggleSave(key: string) {
    const has = ch.save_profs.includes(key);
    patch({ save_profs: has ? ch.save_profs.filter((k) => k !== key) : [...ch.save_profs, key] });
  }

  // Aucune → maîtrise → expertise → aucune
  function cycleSkill(key: string) {
    if (ch.skill_expertise.includes(key)) {
      patch({ skill_profs: ch.skill_profs.filter((k) => k !== key), skill_expertise: ch.skill_expertise.filter((k) => k !== key) });
    } else if (ch.skill_profs.includes(key)) {
      patch({ skill_expertise: [...ch.skill_expertise, key] });
    } else {
      patch({ skill_profs: [...ch.skill_profs, key] });
    }
  }

  return (
    <>
      <Card>
        <Title>Caractéristiques</Title>
        <View style={styles.grid}>
          {ABILITIES.map((a) => {
            const m = modifier(ch.abilities[a.key]);
            return (
              <Pressable
                key={a.key}
                accessibilityRole="button"
                accessibilityLabel={`Test de ${a.label}`}
                onPress={() => roll(`Test de ${a.label}`, m)}
                style={[styles.ability, { borderColor: t.line, backgroundColor: t.bg }]}
              >
                <Label>{a.label}</Label>
                <Text style={[styles.big, { color: t.ink }]}>{signed(m)}</Text>
                <Body muted>{ch.abilities[a.key]}</Body>
              </Pressable>
            );
          })}
        </View>
        <Body muted style={{ fontSize: 13 }}>Touche une valeur pour lancer le d20.</Body>
      </Card>

      <View style={sheetStyles.columns}>
        <View style={sheetStyles.column}>
          <Card>
            <Title>Jets de sauvegarde</Title>
            {ABILITIES.map((a) => {
              const prof = ch.save_profs.includes(a.key);
              const total = modifier(ch.abilities[a.key]) + (prof ? pb : 0);
              return (
                <View key={a.key} style={[sheetStyles.line, { borderColor: t.line }]}>
                  <Pressable
                    disabled={!isGm}
                    hitSlop={10}
                    accessibilityLabel={`Maîtrise de sauvegarde ${a.label}`}
                    onPress={() => toggleSave(a.key)}
                  >
                    <ProfDot level={prof ? 1 : 0} />
                  </Pressable>
                  <Pressable style={styles.rowPress} onPress={() => roll(`Sauvegarde de ${a.label}`, total)}>
                    <Body style={{ flex: 1 }}>{a.label}</Body>
                    <Text style={[sheetStyles.value, { color: prof ? t.accent : t.ink }]}>{signed(total)}</Text>
                  </Pressable>
                </View>
              );
            })}
          </Card>
        </View>

        <View style={sheetStyles.column}>
          <Card>
            <Title>Compétences</Title>
            {SKILLS.map((s) => {
              const level = ch.skill_expertise.includes(s.key) ? 2 : ch.skill_profs.includes(s.key) ? 1 : 0;
              const total = skillTotal(ch, s.key);
              return (
                <View key={s.key} style={[sheetStyles.line, { borderColor: t.line }]}>
                  <Pressable disabled={!isGm} hitSlop={10} accessibilityLabel={`Maîtrise de ${s.label}`} onPress={() => cycleSkill(s.key)}>
                    <ProfDot level={level} />
                  </Pressable>
                  <Pressable style={styles.rowPress} onPress={() => roll(s.label, total)}>
                    <Body style={{ flex: 1 }}>
                      {s.label} <Text style={{ color: t.muted, fontSize: 13 }}>{s.ability}</Text>
                    </Body>
                    <Text style={[sheetStyles.value, { color: level ? t.accent : t.ink }]}>{signed(total)}</Text>
                  </Pressable>
                </View>
              );
            })}
            {isGm && <Body muted style={{ fontSize: 13 }}>Pastille : vide, maîtrise, puis expertise (double bonus).</Body>}
          </Card>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ability: { flexGrow: 1, flexBasis: 100, borderWidth: 1, borderRadius: 8, padding: 8, alignItems: 'center' },
  big: { fontFamily: fonts.display, fontSize: 28, fontWeight: '700' },
  rowPress: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
