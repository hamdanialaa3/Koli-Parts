export const koliTokens = {
  breakpoints: { xs: 375, sm: 414, md: 768, lg: 1024, xl: 1280, xxl: 1920 },
  spacing: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40 },
  touch: { min: 44, comfortable: 48, large: 56 },
  radius: { sm: 6, md: 10, lg: 16, full: 9999 },
  motionMs: { fast: 120, normal: 200, slow: 320 },
  fonts: {
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    heading: "'Exo 2', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
} as const;
