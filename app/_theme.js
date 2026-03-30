/**
 * GynAI Design Tokens — mirrors global.css :root variables and tailwind.config.js
 * Use these in React Native inline style objects instead of raw hex values.
 *
 * Semantic accent colors:
 *   ROSE   → clinical care, primary brand, pregnancy tracker
 *   SAGE   → nature / facilities (nearby hospitals)
 *   SKY    → hydration / water tracking
 *   INDIGO → rest / sleep tracking
 *   AMBER  → body metrics / BMI
 */
export const T = {
  // ── Brand rose ──────────────────────────────────────────────────────────
  pink:         '#ec4899',   // hero / primary CTA (pregnancy card, main actions)
  pinkDark:     '#be185d',   // pressed state / text on rose bg
  pinkLight:    '#f9a8d4',   // subtle text on pink bg
  pinkBg:       '#fdf2f8',   // card tint, icon circle bg
  pinkBorder:   '#fbcfe8',   // dividers, borders
  pinkShadow:   '#ec4899',   // shadow color for pink elements

  // ── Sage green ──────────────────────────────────────────────────────────
  sage:         '#5b9279',   // nearby facilities accent
  sageDark:     '#3d6b54',
  sageBg:       '#edf5f1',   // card tint for sage items

  // ── Sky blue ─────────────────────────────────────────────────────────────
  sky:          '#38bdf8',   // water / hydration tracking
  skyBg:        '#f0f9ff',

  // ── Indigo ───────────────────────────────────────────────────────────────
  indigo:       '#818cf8',   // sleep / rest tracking
  indigoBg:     '#eef2ff',

  // ── Amber ────────────────────────────────────────────────────────────────
  amber:        '#f59e0b',   // body metrics / BMI
  amberBg:      '#fffbeb',

  // ── Page surfaces ───────────────────────────────────────────────────────
  pageBg:       '#faf6f8',   // warm page background
  card:         '#ffffff',   // card / tile backgrounds
  surface:      '#f5f0f3',   // muted section background

  // ── Typography ──────────────────────────────────────────────────────────
  text:         '#1f1724',   // primary text
  subtle:       '#6b7280',   // secondary text
  muted:        '#a1a1aa',   // placeholder, labels

  // ── Borders & dividers ──────────────────────────────────────────────────
  border:       '#f0e8ed',
  divider:      '#f3f4f6',

  // ── Emergency ───────────────────────────────────────────────────────────
  emergencyBg:  '#fef2f2',
  emergency:    '#dc2626',
  emergencyBorder: '#fecaca',

  // ── Section label (uppercase tracking headers) ──────────────────────────
  sectionLabel: '#a1a1aa',
};
