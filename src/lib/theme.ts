import { useColorScheme } from 'react-native';

const light = {
  bg: '#E9ECE7',
  surface: '#FBFCFA',
  sunk: '#DDE2DC',
  ink: '#1B2322',
  muted: '#5A6763',
  line: '#C7CFC9',
  accent: '#7A2E3A',
  accentInk: '#FFF6F4',
  brass: '#9A7424',
  good: '#2E6B45',
  bad: '#A3312B',
};

const dark: typeof light = {
  bg: '#111614',
  surface: '#1A211F',
  sunk: '#0C100F',
  ink: '#E4EAE6',
  muted: '#95A39E',
  line: '#2D3834',
  accent: '#D46A79',
  accentInk: '#1A0B0E',
  brass: '#D2A94F',
  good: '#6FC08E',
  bad: '#EE7A70',
};

export type Palette = typeof light;

export const useTheme = (): Palette => (useColorScheme() === 'dark' ? dark : light);

export const fonts = { display: 'serif' };
