// Vitta+ Messages Service — services/messagesService.ts

export interface SupportAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  read: boolean;
}

export interface QuickQuestion {
  id: string;
  text: string;
  category: 'viagens' | 'educacao' | 'saude' | 'financas' | 'geral';
}

export const supportAgents: SupportAgent[] = [
  {
    id: 'agent-1',
    name: 'Ana Clara Souza',
    role: 'Consultora de Viagens',
    specialty: 'Especialista em viagens acessíveis e grupos 60+',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    isOnline: true,
  },
  {
    id: 'agent-2',
    name: 'Roberto Figueiredo',
    role: 'Orientador Financeiro',
    specialty: 'Planejamento de aposentadoria e previdência',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    isOnline: true,
  },
  {
    id: 'agent-3',
    name: 'Fernanda Costa',
    role: 'Atendimento Geral',
    specialty: 'Suporte ao uso da plataforma e dúvidas gerais',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    isOnline: false,
  },
];

export const quickQuestions: QuickQuestion[] = [
  { id: 'qq-1', text: 'Como faço para me inscrever em uma viagem?', category: 'viagens' },
  { id: 'qq-2', text: 'As viagens têm assistência médica?', category: 'viagens' },
  { id: 'qq-3', text: 'Os cursos têm certificado?', category: 'educacao' },
  { id: 'qq-4', text: 'Como funciona a teleconsulta?', category: 'saude' },
  { id: 'qq-5', text: 'Posso parcelar os serviços?', category: 'financas' },
  { id: 'qq-6', text: 'Preciso de ajuda para usar o app', category: 'geral' },
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'agent-3',
    senderName: 'Fernanda Costa',
    text: 'Olá! Sou a Fernanda, da equipe Vitta+. Estou aqui para te ajudar com qualquer dúvida. Como posso te ajudar hoje?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isFromUser: false,
    read: true,
  },
];

export const getAutoResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  if (msg.includes('viagem') || msg.includes('cruzeiro') || msg.includes('pacote')) {
    return 'Que ótima escolha! Temos pacotes incríveis para 60+, com ritmo tranquilo e toda a assistência que você precisa. Vou te conectar com a Ana Clara, nossa especialista em viagens. Ela já vai te atender!';
  }
  if (msg.includes('financ') || msg.includes('aposentadoria') || msg.includes('investimento')) {
    return 'Entendo! Questões financeiras merecem atenção especial. Nosso orientador Roberto Figueiredo é especialista nisso e pode te ajudar com planejamento personalizado. Posso agendar uma conversa com ele?';
  }
  if (msg.includes('saude') || msg.includes('médic') || msg.includes('consulta')) {
    return 'Sua saúde é nossa prioridade! Você pode solicitar uma teleconsulta diretamente no módulo Saúde do app, ou eu posso te ajudar a fazer isso agora. O que prefere?';
  }
  if (msg.includes('curso') || msg.includes('aula') || msg.includes('aprender')) {
    return 'Adoramos curiosidade! Temos cursos gratuitos e pagos em diversas áreas. Na aba Educação você encontra todos eles, mas se quiser, posso te indicar o que mais combina com seu perfil!';
  }
  return 'Obrigada pela sua mensagem! Vou verificar isso para você e já te respondo. Lembre-se que você também pode nos ligar a qualquer hora pelo botão "Falar com Atendente" na tela inicial.';
};
