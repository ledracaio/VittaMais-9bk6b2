// Vitta+ Travel Service — services/travelService.ts

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  description: string;
  duration: string;
  price: number;
  priceLabel: string;
  type: 'cruzeiro' | 'grupo' | 'bem_estar' | 'cultural';
  typeLabel: string;
  imageUrl: string;
  highlights: string[];
  accessibility: string[];
  departureDate: string;
  availableSpots: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export const travelPackages: TravelPackage[] = [
  {
    id: 'pkg-1',
    title: 'Cruzeiro pelo Mediterrâneo',
    destination: 'Itália, Grécia e Croácia',
    description: 'Uma viagem inesquecível pelos mares mais belos da Europa, com ritmo tranquilo, cabines acessíveis e assistência médica a bordo.',
    duration: '14 dias',
    price: 12800,
    priceLabel: 'R$ 12.800 por pessoa',
    type: 'cruzeiro',
    typeLabel: 'Cruzeiro',
    imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80',
    highlights: ['Cabine com varanda', 'Todas as refeições inclusas', 'Excursões guiadas', 'Intérprete em português'],
    accessibility: ['Cabines adaptadas disponíveis', 'Elevadores em todos os andares', 'Assistência de embarque'],
    departureDate: 'Setembro 2025',
    availableSpots: 12,
    rating: 4.9,
    reviewCount: 147,
    featured: true,
  },
  {
    id: 'pkg-2',
    title: 'Gramado e Serra Gaúcha',
    destination: 'Rio Grande do Sul, Brasil',
    description: 'Experiência única na cidade mais europeia do Brasil: chocolates artesanais, trilhas tranquilas, vinícolas e muito aconchego.',
    duration: '7 dias',
    price: 4200,
    priceLabel: 'R$ 4.200 por pessoa',
    type: 'grupo',
    typeLabel: 'Grupo',
    imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&q=80',
    highlights: ['Hotel boutique 4 estrelas', 'Passeios em grupo reduzido', 'Guia especializado', 'Transfer incluso'],
    accessibility: ['Caminhadas de ritmo tranquilo', 'Veículo adaptado disponível', 'Hospedagem no térreo'],
    departureDate: 'Julho 2025',
    availableSpots: 8,
    rating: 4.8,
    reviewCount: 89,
    featured: true,
  },
  {
    id: 'pkg-3',
    title: 'Retiro de Bem-Estar em Chapada',
    destination: 'Chapada dos Veadeiros, GO',
    description: 'Uma semana de relaxamento profundo na natureza: yoga, meditação, trilhas suaves, alimentação natural e cachoeiras deslumbrantes.',
    duration: '7 dias',
    price: 5600,
    priceLabel: 'R$ 5.600 por pessoa',
    type: 'bem_estar',
    typeLabel: 'Bem-Estar',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    highlights: ['Yoga e meditação diários', 'Alimentação orgânica', 'Trilhas adaptadas', 'Massagem relaxante inclusa'],
    accessibility: ['Trilhas de dificuldade baixa', 'Instrutor de yoga para iniciantes', 'Quarto individual disponível'],
    departureDate: 'Agosto 2025',
    availableSpots: 6,
    rating: 4.7,
    reviewCount: 63,
    featured: false,
  },
  {
    id: 'pkg-4',
    title: 'Portugal e Espanha Cultural',
    destination: 'Lisboa, Porto, Madrid e Sevilha',
    description: 'Mergulhe na história e cultura ibérica, visitando museus, patrimônios históricos e saboreando a gastronomia local.',
    duration: '12 dias',
    price: 9800,
    priceLabel: 'R$ 9.800 por pessoa',
    type: 'cultural',
    typeLabel: 'Cultural',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
    highlights: ['Guia bilíngue', 'Hotéis históricos', 'Ingressos inclusos', 'Jantar de gala em Lisboa'],
    accessibility: ['Transporte adaptado', 'Ritmo de visita tranquilo', 'Museus com acesso facilitado'],
    departureDate: 'Outubro 2025',
    availableSpots: 15,
    rating: 4.9,
    reviewCount: 201,
    featured: false,
  },
  {
    id: 'pkg-5',
    title: 'Cruzeiro pelo Amazonas',
    destination: 'Manaus e Rio Negro, AM',
    description: 'Explore a Amazônia de forma confortável a bordo de um barco boutique, com naturalistas especialistas e contato com comunidades ribeirinhas.',
    duration: '10 dias',
    price: 8400,
    priceLabel: 'R$ 8.400 por pessoa',
    type: 'cruzeiro',
    typeLabel: 'Cruzeiro',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    highlights: ['Barco boutique exclusivo', 'Naturalistas a bordo', 'Birdwatching ao amanhecer', 'Pesca esportiva'],
    accessibility: ['Passeios de canoa tranquilos', 'Barco com acomodações acessíveis', 'Equipe médica disponível'],
    departureDate: 'Novembro 2025',
    availableSpots: 10,
    rating: 4.6,
    reviewCount: 52,
    featured: false,
  },
];

export const getTravelPackages = (): TravelPackage[] => travelPackages;

export const getFeaturedPackages = (): TravelPackage[] =>
  travelPackages.filter((p) => p.featured);

export const getPackagesByType = (type: TravelPackage['type']): TravelPackage[] =>
  travelPackages.filter((p) => p.type === type);
