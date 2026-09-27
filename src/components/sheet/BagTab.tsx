import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COINS, coinsInGold, type CoinKey } from '../../lib/rules';
import { fonts, useTheme } from '../../lib/theme';
import { Body, Button, Card, Label, Row, Title } from '../ui';
import { TextArea, type SheetProps } from './common';

export function BagTab({ ch, canInventory, patch }: SheetProps) {
  const t = useTheme();
  const [step, setStep] = useState('1');
  const n = Math.max(1, parseInt(step, 10) || 1);

  function change(key: CoinKey, delta: number) {
    patch({ coins: { ...ch.coins, [key]: Math.max(0, (ch.coins[key] ?? 0) + delta) } });
  }

  const total = coinsInGold(ch.coins);

  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Title>Bourse</Title>
          <Body muted>≈ {Number.isInteger(total) ? total : total.toFixed(2)} po</Body>
        </Row>
        <View style={styles.coins}>
          {COINS.map((c) => (
            <View key={c.key} style={[styles.coin, { borderColor: c.key === 'po' ? t.brass : t.line, backgroundColor: t.bg }]}>
              <Label>{c.label}</Label>
              <Text style={[styles.amount, { color: c.key === 'po' ? t.brass : t.ink }]}>{ch.coins[c.key] ?? 0}</Text>
              <Text style={{ color: t.muted, fontSize: 12 }}>{c.name}</Text>
              {canInventory && (
                <Row style={{ gap: 6, justifyContent: 'center' }}>
                  <Button small label="−" onPress={() => change(c.key, -n)} />
                  <Button small label="+" onPress={() => change(c.key, n)} />
                </Row>
              )}
            </View>
          ))}
        </View>
        {canInventory && (
          <Row>
            <Body muted>Ajouter ou retirer par</Body>
            <TextInput
              value={step}
              onChangeText={setStep}
              keyboardType="number-pad"
              accessibilityLabel="Quantité de pièces par appui"
              style={[styles.step, { color: t.ink, borderColor: t.line, backgroundColor: t.bg }]}
            />
          </Row>
        )}
      </Card>

      <Card>
        <Title>Inventaire</Title>
        <TextArea
          value={ch.inventory}
          editable={canInventory}
          onSave={(v) => patch({ inventory: v })}
          placeholder="Sac à dos, corde de 15 m, rations (5 jours)…"
          minHeight={200}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  coins: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  coin: { flexGrow: 1, flexBasis: 110, borderWidth: 1, borderRadius: 8, padding: 8, alignItems: 'center', gap: 4 },
  amount: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700' },
  step: { width: 70, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16, textAlign: 'center' },
});
