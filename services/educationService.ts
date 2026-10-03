// Vitta+ Education Service — services/educationService.ts

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  description: string;
  category: 'financas' | 'tecnologia' | 'saude' | 'artes' | 'bem_estar';
  categoryLabel: string;
  duration: string;
  format: 'online' | 'presencial' | 'hibrido';
  formatLabel: string;
  schedule: string;
  price: number;
  priceLabel: string;
  level: 'iniciante' | 'intermediario';
  levelLabel: string;
  enrolledCount: number;
  maxStudents: number;
  rating: number;
  startDate: string;
  imageUrl: string;
  topics: string[];
}

export const courses: Course[] = [
  {
    id: 'crs-1',
    title: 'Finanças na Aposentadoria',
    instructor: 'Prof. Ricardo Alves',
    instructorTitle: 'Economista e planejador financeiro',
    description: 'Aprenda a organizar suas finanças, planejar uma renda sustentável e proteger seu patrimônio com estratégias simples e seguras.',
    category: 'financas',
    categoryLabel: 'Finanças',
    duration: '8 semanas',
    format: 'online',
    formatLabel: 'Online ao vivo',
    schedule: 'Terças e Quintas, 14h',
    price: 0,
    priceLabel: 'Gratuito',
    level: 'iniciante',
    levelLabel: 'Iniciante',
    enrolledCount: 234,
    maxStudents: 300,
    rating: 4.8,
    startDate: '10 de Julho, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    topics: ['Orçamento pessoal', 'Investimentos seguros', 'Previdência privada', 'Planejamento de herança'],
  },
  {
    id: 'crs-2',
    title: 'Fotografia com Celular',
    instructor: 'Profa. Lúcia Ferreira',
    instructorTitle: 'Fotógrafa e educadora digital',
    description: 'Descubra como tirar fotos incríveis dos seus momentos especiais usando apenas o celular que você já tem, sem complicações.',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia',
    duration: '4 semanas',
    format: 'hibrido',
    formatLabel: 'Híbrido',
    schedule: 'Sábados, 10h',
    price: 180,
    priceLabel: 'R$ 180',
    level: 'iniciante',
    levelLabel: 'Iniciante',
    enrolledCount: 87,
    maxStudents: 120,
    rating: 4.9,
    startDate: '5 de Julho, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80',
    topics: ['Configurações básicas da câmera', 'Enquadramento e luz', 'Edição simples', 'Compartilhamento seguro'],
  },
  {
    id: 'crs-3',
    title: 'Memória e Saúde Cognitiva',
    instructor: 'Dra. Patrícia Moura',
    instructorTitle: 'Neuropsicóloga clínica',
    description: 'Exercícios práticos e hábitos baseados em evidências para manter a memória ativa, a mente afiada e o bem-estar mental ao longo dos anos.',
    category: 'saude',
    categoryLabel: 'Saúde',
    duration: '6 semanas',
    format: 'online',
    formatLabel: 'Online ao vivo',
    schedule: 'Segundas, 16h',
    price: 0,
    priceLabel: 'Gratuito',
    level: 'iniciante',
    levelLabel: 'Iniciante',
    enrolledCount: 412,
    maxStudents: 500,
    rating: 4.7,
    startDate: '7 de Julho, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
    topics: ['Exercícios de memória', 'Sono e cognição', 'Alimentação para o cérebro', 'Meditação mindfulness'],
  },
  {
    id: 'crs-4',
    title: 'Aquarela para Iniciantes',
    instructor: 'Prof. Carlos Andrade',
    instructorTitle: 'Artista plástico e professor',
    description: 'Expresse sua criatividade através da aquarela. Uma prática relaxante e terapêutica que não exige nenhuma experiência prévia.',
    category: 'artes',
    categoryLabel: 'Artes',
    duration: '8 semanas',
    format: 'presencial',
    formatLabel: 'Presencial',
    schedule: 'Quartas, 15h — São Paulo',
    price: 320,
    priceLabel: 'R$ 320',
    level: 'iniciante',
    levelLabel: 'Iniciante',
    enrolledCount: 18,
    maxStudents: 20,
    rating: 4.9,
    startDate: '9 de Julho, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&q=80',
    topics: ['Técnicas básicas', 'Cores e pigmentos', 'Paisagens e natureza morta', 'Exposição dos trabalhos'],
  },
  {
    id: 'crs-5',
    title: 'Yoga para Mobilidade e Equilíbrio',
    instructor: 'Profa. Sandra Lima',
    instructorTitle: 'Professora de yoga certificada',
    description: 'Sequências suaves e adaptadas para fortalecer o corpo, melhorar o equilíbrio e reduzir dores articulares no dia a dia.',
    category: 'bem_estar',
    categoryLabel: 'Bem-Estar',
    duration: 'Aulas semanais',
    format: 'hibrido',
    formatLabel: 'Híbrido',
    schedule: 'Terças e Sextas, 8h',
    price: 120,
    priceLabel: 'R$ 120/mês',
    level: 'iniciante',
    levelLabel: 'Iniciante',
    enrolledCount: 156,
    maxStudents: 200,
    rating: 4.8,
    startDate: 'Inscrição aberta',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    topics: ['Postura e respiração', 'Fortalecimento gentil', 'Prevenção de quedas', 'Relaxamento guiado'],
  },
  {
    id: 'crs-6',
    title: 'WhatsApp e Redes Sociais com Segurança',
    instructor: 'Prof. Marcos Nunes',
    instructorTitle: 'Especialista em tecnologia e segurança digital',
    description: 'Aprenda a usar WhatsApp, Instagram e email com confiança e segurança, evitando golpes e protegendo sua privacidade.',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia',
    duration: '3 semanas',
    format: 'online',
    formatLabel: 'Online ao vivo',
    schedule: 'Sábados, 14h',
    price: 0,
    priceLabel: 'Gratuito',
    level: 'iniciante',
    levelLabel: 'Iniciante',
    enrolledCount: 567,
    maxStudents: 600,
    rating: 4.6,
    startDate: '12 de Julho, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    topics: ['WhatsApp seguro', 'Reconhecer golpes digitais', 'Senhas fortes', 'Privacidade nas redes'],
  },
];

export const getCourses = (): Course[] => courses;

export const getCoursesByCategory = (category: Course['category']): Course[] =>
  courses.filter((c) => c.category === category);

export const getFreeCourses = (): Course[] => courses.filter((c) => c.price === 0);
