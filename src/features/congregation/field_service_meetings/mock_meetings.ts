import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

const unsortedMeetings: FieldServiceMeetingDataType[] = [
  {
    meeting_uid: '1',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-02T09:30:00',
      type: 'joint',
      conductor: 'Luciano Campos',
      assistant: 'Luis Coelho',
      materials: 'Brochura Ame as Pessoas - Lição 8 - Imite Jesus - Pontos 3-5',
    },
  },
  {
    meeting_uid: '2',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-03T09:30:00',
      type: 'joint',
      conductor: 'Ernesto',
      assistant: 'João Silvestre',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
  {
    meeting_uid: '3',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-06T09:30:00',
      type: 'joint',
      conductor: 'José Pinto',
      assistant: 'N/A',
      materials:
        'Brochura Leitura e Ensino - Lição 19 - Toque o coração das Pessoas (Na Pregação',
    },
  },
  {
    meeting_uid: '11',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-09T09:30:00',
      type: 'group',
      group: 'Esteveira',
      conductor: 'Josías António',
      location: 'Natanael Fortunato',
      materials: 'Brochura Ame as Pessoas - Lição 8 - Imite Jesus - Pontos 3-5',
    },
  },
  {
    meeting_uid: '10',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-09T10:00:00',
      type: 'group',
      group: 'Passos Esteves',
      conductor: 'José Pinto',
      location: 'José Pinto',
      materials: 'Brochura Ame as Pessoas - Lição 8 - Imite Jesus - Pontos 3-5',
    },
  },
  {
    meeting_uid: '12',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-09T10:00:00',
      type: 'group',
      group: 'Bairro da Camara',
      conductor: 'Armindo Ramalho',
      location: 'Manuel Ramalho',
      materials: 'Brochura Ame as Pessoas - Lição 8 - Imite Jesus - Pontos 3-5',
    },
  },
  {
    meeting_uid: '13',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-09T10:00:00',
      type: 'group',
      group: 'Grupo Salão 1',
      conductor: 'Samuel Pereira',
      location: 'Salão do Reino',
      materials: 'Brochura Ame as Pessoas - Lição 8 - Imite Jesus - Pontos 3-5',
    },
  },
  {
    meeting_uid: '14',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-09T10:00:00',
      type: 'group',
      group: 'Grupo Salão 2',
      conductor: 'Fábio Ferreira',
      location: 'Salão do Reino',
      materials: 'Brochura Ame as Pessoas - Lição 8 - Imite Jesus - Pontos 3-5',
    },
  },
  {
    meeting_uid: '4',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-10T09:30:00',
      type: 'joint',
      conductor: 'Fernando Silvestre',
      assistant: 'Fábio Ferreira',
      materials:
        'W 21/ Julho - Será que pode ajudar no trabalho de fazer Discípulos? Página 3 - Parágrafo 3-6',
    },
  },
  {
    meeting_uid: '5',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-13T09:30:00',
      type: 'joint',
      conductor: 'Armindo Ramalho',
      assistant: 'N/A',
      materials: 'Introdução à Palavra de Deus - Pergunta 1 - Quem é Deus?',
    },
  },
  {
    meeting_uid: '6',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-16T09:30:00',
      type: 'joint',
      conductor: 'Luis Silvestre',
      assistant: 'Gonçalo Coelho',
      materials:
        'W 21/ Julho - O Amor Motiva-nos a fazer discípulos - Página 5 - Parágrafos 7-9',
    },
  },
  {
    meeting_uid: '7',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-20T09:30:00',
      type: 'joint',
      conductor: 'António José',
      assistant: 'N/A',
      materials:
        'Introdução à Palavra de Deus - Pergunta 18 - Como pode achegar-se a Deus?',
    },
  },
  {
    meeting_uid: '8',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-27T09:30:00',
      type: 'joint',
      conductor: 'António José',
      assistant: 'N/A',
      materials:
        'Introdução à Palavra de Deus - Pergunta 10 - O que a Bíblia promete para o Futuro?',
    },
  },
  {
    meeting_uid: '9',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-30T09:30:00',
      type: 'joint',
      conductor: 'António José',
      assistant: 'Ruben Boneco',
      materials:
        'Brochura Leitura e Ensino - Lição 4 - Introduza bem os Textos.',
    },
  },
  {
    meeting_uid: '16',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-23T09:30:00',
      type: 'group',
      group: 'Esteveira',
      conductor: 'António Evangelista',
      location: 'Nataniel Fortunato',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
  {
    meeting_uid: '15',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-23T10:00:00',
      type: 'group',
      group: 'Passos Esteves',
      conductor: 'Luis Coelho',
      location: 'José Pinto',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
  {
    meeting_uid: '17',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-23T10:00:00',
      type: 'group',
      group: 'Bairro da Camara',
      conductor: 'Armindo Ramalho',
      location: 'Manuel Ramalho',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
  {
    meeting_uid: '18',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-23T10:00:00',
      type: 'group',
      group: 'Grupo Salão 1',
      conductor: 'Samuel Pereira',
      location: 'Salão do Reino',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
  {
    meeting_uid: '19',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-23T10:00:00',
      type: 'group',
      group: 'Grupo Salão 2',
      conductor: 'Ernesto Franco',
      location: 'Salão do Reino',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
  {
    meeting_uid: '20',
    meeting_data: {
      _deleted: false,
      updatedAt: '2025-08-02T09:30:00',
      date: '2025-08-23T10:00:00',
      type: 'zoom',
      conductor: 'Armindo Ramalho',
      materials: 'Brochura Leitura e Ensino - Lição 8 - Ensine com Ilustrações',
    },
  },
];

export const mockMeetings: FieldServiceMeetingDataType[] =
  unsortedMeetings.sort(
    (a, b) =>
      new Date(a.meeting_data.date).getTime() -
      new Date(b.meeting_data.date).getTime()
  );
