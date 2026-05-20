import type { ThemeKey } from '../types';

export interface ThemeMeta {
  key: ThemeKey;
  label: string;
  emoji: string;
  bg: string;
}

export const THEMES: ThemeMeta[] = [
  { key: 'dark',   label: 'Dark',   emoji: '🌑', bg: '#080808' },
  { key: 'light',  label: 'Hell',   emoji: '☀️', bg: '#f4f3ef' },
  { key: 'ocean',  label: 'Ozean',  emoji: '🌊', bg: '#0b1120' },
  { key: 'forest', label: 'Forest', emoji: '🌿', bg: '#0b140a' },
];
