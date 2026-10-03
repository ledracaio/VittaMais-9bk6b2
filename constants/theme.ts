// Vitta+ Design System — constants/theme.ts

export const Colors = {
  // Brand
  primary: '#1A6B6B',        // Deep trustworthy teal
  primaryLight: '#2A8A8A',
  primaryMuted: '#E8F4F4',

  // Module accent colors
  travel: '#E07A5F',          // Warm coral
  travelLight: '#FDF0EC',
  education: '#C9922A',       // Golden amber
  educationLight: '#FDF5E6',
  health: '#B05070',          // Muted rose/berry
  healthLight: '#F9EDF2',
  finance: '#4A8FA8',         // Soft steel blue
  financeLight: '#EBF4F8',

  // Neutral palette
  background: '#FAF7F2',      // Soft cream
  surface: '#FFFFFF',
  surfaceMuted: '#F3EFE9',
  border: '#E4DDD4',
  borderLight: '#EEE9E2',

  // Text
  textPrimary: '#2C2826',     // Dark warm charcoal
  textSecondary: '#6B6460',
  textMuted: '#9C9490',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // Status
  success: '#3A8A5A',
  successLight: '#EBF7EF',
  warning: '#C9922A',
  error: '#C0392B',
  errorLight: '#FDECEA',

  // Support
  supportGreen: '#27AE60',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#2C2826',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C2826',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C2826',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Module definitions
export const Modules = {
  travel: {
    key: 'travel',
    label: 'Viagens',
    icon: 'flight' as const,
    color: Colors.travel,
    background: Colors.travelLight,
    route: '/travel',
  },
  education: {
    key: 'education',
    label: 'Educação',
    icon: 'school' as const,
    color: Colors.education,
    background: Colors.educationLight,
    route: '/education',
  },
  health: {
    key: 'health',
    label: 'Saúde',
    icon: 'favorite' as const,
    color: Colors.health,
    background: Colors.healthLight,
    route: '/health',
  },
  finance: {
    key: 'finance',
    label: 'Finanças',
    icon: 'account-balance' as const,
    color: Colors.finance,
    background: Colors.financeLight,
    route: '/finance',
  },
};
