import { useState } from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, useTheme } from '../../lib/theme';
import type { Character } from '../../lib/types';
import { Body, Button, Card, ErrorText, Field, Row, Title } from '../ui';

const SIZE = 133;
const MAX_SIDE = 320;

/** Sur le web : choisir une image sur l'appareil, la réduire et la renvoyer en data URL (JPEG, ~30 ko). */
function pickImageOnWeb(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error('Aucune image choisie.'));
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error("Cette image n'a pas pu être lue."));
      img.src = url;
    };
    input.click();
  });
}

/** Cadre d'avatar de l'en-tête. Le MJ le touche pour changer l'image, le joueur pour l'agrandir. */
export function Avatar({ ch, isGm, patch }: { ch: Character; isGm: boolean; patch: (values: Partial<Character>) => Promise<boolean> }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const avatar = ch.avatar ?? '';

  if (!avatar && !isGm) return null;

  async function save(value: string) {
    setError('');
    if (await patch({ avatar: value })) {
      setOpen(false);
      setLink('');
    } else {
      setError("L'avatar n'a pas pu être enregistré. Le script 0008_avatar.sql a-t-il été lancé dans Supabase ?");
    }
  }

  async function pick() {
    try {
      await save(await pickImageOnWeb());
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isGm ? "Changer l'avatar" : "Agrandir l'avatar"}
        onPress={() => setOpen(true)}
        style={[styles.frame, { borderColor: avatar ? t.brass : t.line, backgroundColor: t.sunk }]}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.empty}>
            <Text style={[styles.initial, { color: t.muted }]}>{ch.name.trim().charAt(0).toUpperCase() || '?'}</Text>
            <Text style={{ color: t.muted, fontSize: 13 }}>+ image</Text>
          </View>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={{ width: '100%', maxWidth: 420 }} onPress={() => {}}>
            <Card>
              <Title>{ch.name}</Title>
              {avatar ? (
                <Image source={{ uri: avatar }} style={[styles.large, { borderColor: t.brass }]} resizeMode="cover" />
              ) : (
                <Body muted>Pas encore d'image pour ce personnage.</Body>
              )}
              {isGm && (
                <>
                  {Platform.OS === 'web' && <Button kind="primary" label="Choisir une image sur l'appareil" onPress={pick} />}
                  {/* En ligne pour que le champ ne prenne pas 120 px de haut */}
                  <View style={{ flexDirection: 'row' }}>
                  <Field
                    label={Platform.OS === 'web' ? "Ou colle le lien d'une image" : "Lien d'une image (depuis un téléphone, passe par la version web pour envoyer un fichier)"}
                    value={link}
                    onChangeText={setLink}
                    autoCapitalize="none"
                    placeholder="https://…"
                  />
                  </View>
                  <Row>
                    <Button small label="Utiliser ce lien" disabled={!/^https?:\/\/\S+$/i.test(link.trim())} onPress={() => save(link.trim())} />
                    {avatar ? <Button small kind="danger" label="Retirer l'image" onPress={() => save('')} /> : null}
                  </Row>
                </>
              )}
              {error ? <ErrorText>{error}</ErrorText> : null}
              <Button label="Fermer" onPress={() => setOpen(false)} />
            </Card>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  frame: { width: SIZE, height: SIZE, borderRadius: 14, borderWidth: 2, overflow: 'hidden', flexShrink: 0 },
  image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.display, fontSize: 48, fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  large: { width: '100%', aspectRatio: 1, borderRadius: 14, borderWidth: 2 },
});
