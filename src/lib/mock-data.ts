export interface Guia {
  id: string;
  nome: string;
  foto: string;
  cargo: string;
  whatsapp: string;
  email: string;
}

export interface Sala {
  id: string;
  nome: string;
  bloco: string;
  andar: string;
  capacidade: number;
  descricao_rota: string[];
  tempo_estimado: string;
  distancia: string;
}

export interface Workshop {
  id: string;
  nome: string;
  descricao: string;
  horario_inicio: string;
  horario_fim: string;
  sala_id: string;
  guia_id: string;
  capacidade: number;
}

export interface Participante {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto?: string;
  workshop_id: string;
  status_confirmacao: "confirmado" | "pendente";
}

export interface AgendaItem {
  id: string;
  titulo: string;
  horario: string;
  descricao: string;
  tipo: "credenciamento" | "workshop" | "intervalo" | "encerramento" | "extra";
}

export const guias: Guia[] = [
  {
    id: "g1",
    nome: "Mariana Souza",
    foto: "https://i.pravatar.cc/200?img=47",
    cargo: "Coordenadora de Inovação",
    whatsapp: "+5551999990001",
    email: "mariana@institutocaldeira.org",
  },
  {
    id: "g2",
    nome: "Ricardo Lima",
    foto: "https://i.pravatar.cc/200?img=12",
    cargo: "Mentor de Tecnologia",
    whatsapp: "+5551999990002",
    email: "ricardo@institutocaldeira.org",
  },
  {
    id: "g3",
    nome: "Camila Ferreira",
    foto: "https://i.pravatar.cc/200?img=45",
    cargo: "Especialista em UX",
    whatsapp: "+5551999990003",
    email: "camila@institutocaldeira.org",
  },
];

export const salas: Sala[] = [
  {
    id: "s1",
    nome: "Sala Workshop IA - 204",
    bloco: "Bloco A",
    andar: "2º andar",
    capacidade: 60,
    tempo_estimado: "3 min",
    distancia: "120 m",
    descricao_rota: [
      "Entre pela recepção principal do Instituto Caldeira",
      "Caminhe 30 metros em frente pelo hall central",
      "Vire à direita no Corredor A",
      "Suba a escada (ou elevador) até o 2º andar",
      "A Sala 204 estará à sua esquerda",
    ],
  },
  {
    id: "s2",
    nome: "Auditório Caldeira",
    bloco: "Bloco Central",
    andar: "Térreo",
    capacidade: 300,
    tempo_estimado: "1 min",
    distancia: "40 m",
    descricao_rota: [
      "Entre pela recepção principal",
      "Siga em frente pelo hall principal",
      "O Auditório estará logo à direita",
    ],
  },
  {
    id: "s3",
    nome: "Lab Maker - 305",
    bloco: "Bloco B",
    andar: "3º andar",
    capacidade: 40,
    tempo_estimado: "5 min",
    distancia: "180 m",
    descricao_rota: [
      "Entre pela recepção principal",
      "Caminhe pelo hall e siga para o Bloco B",
      "Use o elevador até o 3º andar",
      "Vire à esquerda ao sair do elevador",
      "Lab Maker 305 estará no fim do corredor",
    ],
  },
];

export const workshops: Workshop[] = [
  {
    id: "w1",
    nome: "Inteligência Artificial Aplicada",
    descricao: "Hands-on com LLMs e automações práticas para o dia a dia.",
    horario_inicio: "10:00",
    horario_fim: "12:00",
    sala_id: "s1",
    guia_id: "g2",
    capacidade: 60,
  },
  {
    id: "w2",
    nome: "Keynote — O Futuro da Inovação",
    descricao: "Painel principal com lideranças do ecossistema.",
    horario_inicio: "09:00",
    horario_fim: "10:00",
    sala_id: "s2",
    guia_id: "g1",
    capacidade: 300,
  },
  {
    id: "w3",
    nome: "Prototipação no Lab Maker",
    descricao: "Experiência prática de prototipagem rápida.",
    horario_inicio: "14:00",
    horario_fim: "16:00",
    sala_id: "s3",
    guia_id: "g3",
    capacidade: 40,
  },
];

export const participantes: Participante[] = [
  {
    id: "p1",
    nome: "Lucas Andrade",
    email: "lucas@exemplo.com",
    telefone: "+5551988880001",
    foto: "https://i.pravatar.cc/200?img=33",
    workshop_id: "w1",
    status_confirmacao: "confirmado",
  },
  {
    id: "p2",
    nome: "Ana Beatriz Rocha",
    email: "ana@exemplo.com",
    telefone: "+5551988880002",
    foto: "https://i.pravatar.cc/200?img=49",
    workshop_id: "w3",
    status_confirmacao: "confirmado",
  },
  {
    id: "p3",
    nome: "Pedro Henrique",
    email: "pedro@exemplo.com",
    telefone: "+5551988880003",
    workshop_id: "w2",
    status_confirmacao: "confirmado",
  },
];

export const agenda: AgendaItem[] = [
  { id: "a1", titulo: "Credenciamento", horario: "08:00 – 09:00", descricao: "Retirada de credencial na recepção principal.", tipo: "credenciamento" },
  { id: "a2", titulo: "Keynote de Abertura", horario: "09:00 – 10:00", descricao: "Auditório Caldeira.", tipo: "workshop" },
  { id: "a3", titulo: "Workshops — Bloco 1", horario: "10:00 – 12:00", descricao: "Salas distribuídas pelo Instituto.", tipo: "workshop" },
  { id: "a4", titulo: "Intervalo / Almoço", horario: "12:00 – 13:30", descricao: "Praça de alimentação e área de convivência.", tipo: "intervalo" },
  { id: "a5", titulo: "Workshops — Bloco 2", horario: "14:00 – 16:00", descricao: "Salas distribuídas pelo Instituto.", tipo: "workshop" },
  { id: "a6", titulo: "Networking", horario: "16:00 – 17:00", descricao: "Hall principal — café e conexões.", tipo: "extra" },
  { id: "a7", titulo: "Encerramento", horario: "17:00 – 17:30", descricao: "Auditório Caldeira.", tipo: "encerramento" },
];

export const evento = {
  id: "e1",
  nome: "Caldeira Innovation Day 2026",
  data: "13 de Junho de 2026",
  descricao: "Um dia inteiro de workshops, painéis e experiências no Instituto Caldeira.",
};

// API simulada
export function findParticipanteByEmail(email: string): Participante | undefined {
  return participantes.find((p) => p.email.toLowerCase() === email.toLowerCase().trim());
}

export function getWorkshop(id: string) {
  return workshops.find((w) => w.id === id);
}
export function getSala(id: string) {
  return salas.find((s) => s.id === id);
}
export function getGuia(id: string) {
  return guias.find((g) => g.id === id);
}
