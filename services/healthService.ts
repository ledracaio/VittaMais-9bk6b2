// Vitta+ Health Service — services/healthService.ts

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface HealthLog {
  id: string;
  date: string;
  dateLabel: string;
  mood: MoodLevel;
  moodLabel: string;
  energyLevel: MoodLevel;
  note: string;
  symptoms: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'nutricao' | 'movimento' | 'mente' | 'sono';
  icon: string;
}

export const moodLabels: Record<MoodLevel, string> = {
  1: 'Muito ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bem',
  5: 'Muito bem',
};

export const moodEmoji: Record<MoodLevel, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😄',
};

export const mockHealthLogs: HealthLog[] = [
  {
    id: 'log-1',
    date: '2025-06-30',
    dateLabel: 'Ontem',
    mood: 4,
    moodLabel: 'Bem',
    energyLevel: 4,
    note: 'Caminhei 30 minutos pela manhã. Me senti bem disposta.',
    symptoms: [],
  },
  {
    id: 'log-2',
    date: '2025-06-29',
    dateLabel: '29 de Junho',
    mood: 3,
    moodLabel: 'Regular',
    energyLevel: 3,
    note: 'Dormi mal à noite. Um pouco cansada durante o dia.',
    symptoms: ['Cansaço', 'Dificuldade para dormir'],
  },
  {
    id: 'log-3',
    date: '2025-06-28',
    dateLabel: '28 de Junho',
    mood: 5,
    moodLabel: 'Muito bem',
    energyLevel: 5,
    note: 'Ótimo dia! Fui ao médico e os exames estão todos bons.',
    symptoms: [],
  },
  {
    id: 'log-4',
    date: '2025-06-27',
    dateLabel: '27 de Junho',
    mood: 4,
    moodLabel: 'Bem',
    energyLevel: 3,
    note: 'Fiz yoga pela manhã. Um pouco de dor no joelho à tarde.',
    symptoms: ['Dor no joelho'],
  },
  {
    id: 'log-5',
    date: '2025-06-26',
    dateLabel: '26 de Junho',
    mood: 2,
    moodLabel: 'Ruim',
    energyLevel: 2,
    note: 'Me senti mal o dia todo. Fiquei em casa descansando.',
    symptoms: ['Dor de cabeça', 'Náusea'],
  },
];

export const healthTips: HealthTip[] = [
  {
    id: 'tip-1',
    title: 'Hidratação',
    description: 'Beba pelo menos 6 a 8 copos de água por dia. A sensação de sede diminui com a idade.',
    category: 'nutricao',
    icon: 'water-drop',
  },
  {
    id: 'tip-2',
    title: 'Caminhada diária',
    description: '30 minutos de caminhada por dia reduzem o risco de doenças cardíacas e melhoram o humor.',
    category: 'movimento',
    icon: 'directions-walk',
  },
  {
    id: 'tip-3',
    title: 'Sono reparador',
    description: 'Tente manter um horário fixo para dormir e acordar. O sono de qualidade é essencial para a memória.',
    category: 'sono',
    icon: 'bedtime',
  },
  {
    id: 'tip-4',
    title: 'Conexão social',
    description: 'Conversar com amigos e familiares regularmente protege contra depressão e declínio cognitivo.',
    category: 'mente',
    icon: 'people',
  },
];

export const getHealthLogs = (): HealthLog[] => mockHealthLogs;
export const getHealthTips = (): HealthTip[] => healthTips;
