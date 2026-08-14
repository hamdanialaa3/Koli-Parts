export const typography = {
  family: {
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    heading: "'Exo 2', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  size: {
    h1: { desktop: '2rem', tablet: '1.75rem', mobile: '1.5rem' },
    h2: { desktop: '1.75rem', tablet: '1.5rem', mobile: '1.375rem' },
    h3: { desktop: '1.5rem', tablet: '1.375rem', mobile: '1.25rem' },
    h4: { desktop: '1.25rem', tablet: '1.125rem', mobile: '1.125rem' },
    body: { large: '1.125rem', normal: '1rem', small: '0.875rem', tiny: '0.75rem' },
  },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
} as const;
