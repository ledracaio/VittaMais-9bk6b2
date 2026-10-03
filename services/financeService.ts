// Vitta+ Finance Service — services/financeService.ts

export interface FinanceConsultantTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface RetirementSimulation {
  monthlyIncome: number;
  yearsToRetirement: number;
  estimatedMonthlyBenefit: number;
  recommendedSavings: number;
  projection: { year: number; balance: number }[];
}

export const consultantTopics: FinanceConsultantTopic[] = [
  {
    id: 'topic-1',
    title: 'Planejamento da Aposentadoria',
    description: 'Como organizar sua renda e garantir conforto financeiro na aposentadoria.',
    icon: 'savings',
  },
  {
    id: 'topic-2',
    title: 'Herança e Sucessão',
    description: 'Planejamento patrimonial para proteger seu legado e facilitar para seus herdeiros.',
    icon: 'account-balance',
  },
  {
    id: 'topic-3',
    title: 'Renda Extra Segura',
    description: 'Investimentos e alternativas para complementar sua renda sem riscos desnecessários.',
    icon: 'trending-up',
  },
  {
    id: 'topic-4',
    title: 'Previdência Privada',
    description: 'PGBL, VGBL e outras opções: qual é o melhor para o seu perfil.',
    icon: 'shield',
  },
  {
    id: 'topic-5',
    title: 'Proteção Contra Golpes',
    description: 'Como identificar e se proteger de fraudes financeiras e golpes em idosos.',
    icon: 'security',
  },
];

export const simulateRetirement = (params: {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
}): RetirementSimulation => {
  const { currentAge, retirementAge, currentSavings, monthlyContribution, annualReturnRate } = params;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyRate = annualReturnRate / 100 / 12;

  let balance = currentSavings;
  const projection: { year: number; balance: number }[] = [];

  for (let month = 0; month <= monthsToRetirement; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      projection.push({
        year: currentAge + month / 12,
        balance: Math.round(balance),
      });
    }
  }

  const finalBalance = projection[projection.length - 1]?.balance ?? currentSavings;
  const estimatedMonthlyBenefit = Math.round((finalBalance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -240)));
  const recommendedSavings = Math.round(finalBalance * 0.04 / 12);

  return {
    monthlyIncome: estimatedMonthlyBenefit,
    yearsToRetirement,
    estimatedMonthlyBenefit: Math.max(estimatedMonthlyBenefit, recommendedSavings),
    recommendedSavings,
    projection,
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
