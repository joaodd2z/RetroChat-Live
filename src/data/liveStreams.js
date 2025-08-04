// Configuração de streams ao vivo
export const liveStreams = {
  sports: {
    football: [
      {
        id: 'futebol-1',
        name: '🏆 Futebol Brasileiro',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Transmissão ao vivo dos principais jogos',
        category: 'Futebol',
        isLive: true
      },
      {
        id: 'futebol-2',
        name: '⚽ Champions League',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Liga dos Campeões da UEFA',
        category: 'Futebol',
        isLive: true
      },
      {
        id: 'futebol-3',
        name: '🇧🇷 Copa do Brasil',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Copa do Brasil ao vivo',
        category: 'Futebol',
        isLive: true
      }
    ],
    basketball: [
      {
        id: 'basquete-1',
        name: '🏀 NBA Live',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Jogos da NBA ao vivo',
        category: 'Basquete',
        isLive: true
      }
    ],
    volleyball: [
      {
        id: 'volei-1',
        name: '🏐 Superliga',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Superliga de Vôlei',
        category: 'Vôlei',
        isLive: true
      }
    ]
  },
  entertainment: {
    music: [
      {
        id: 'music-1',
        name: '🎵 Lofi Hip Hop',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Música relaxante 24/7',
        category: 'Música',
        isLive: true
      },
      {
        id: 'music-2',
        name: '🎶 Rock Clássico',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Os melhores clássicos do rock',
        category: 'Música',
        isLive: true
      }
    ],
    gaming: [
      {
        id: 'gaming-1',
        name: '🎮 Gaming Stream',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Gameplay ao vivo',
        category: 'Gaming',
        isLive: true
      }
    ],
    relaxation: [
      {
        id: 'relax-1',
        name: '🌊 Sons da Natureza',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Sons relaxantes da natureza',
        category: 'Relaxamento',
        isLive: true
      },
      {
        id: 'relax-2',
        name: '🔥 Lareira Virtual',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Lareira aconchegante 24/7',
        category: 'Relaxamento',
        isLive: true
      }
    ]
  }
};

// Função para obter todas as streams
export const getAllStreams = () => {
  const allStreams = [];
  
  Object.values(liveStreams).forEach(category => {
    Object.values(category).forEach(subcategory => {
      allStreams.push(...subcategory);
    });
  });
  
  return allStreams;
};

// Função para obter streams por categoria
export const getStreamsByCategory = (category) => {
  if (liveStreams[category]) {
    const streams = [];
    Object.values(liveStreams[category]).forEach(subcategory => {
      streams.push(...subcategory);
    });
    return streams;
  }
  return [];
};

// Função para obter stream por ID
export const getStreamById = (id) => {
  const allStreams = getAllStreams();
  return allStreams.find(stream => stream.id === id);
};

// Função para obter streams de futebol
export const getFootballStreams = () => {
  return liveStreams.sports.football || [];
};

// Função para verificar se uma stream está ao vivo
export const isStreamLive = (streamId) => {
  const stream = getStreamById(streamId);
  return stream ? stream.isLive : false;
};

// URLs de backup para quando as principais não funcionarem
export const backupStreams = {
  football: [
    'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'https://www.youtube.com/watch?v=5qap5aO4i9A',
    'https://www.youtube.com/watch?v=DWcJFNfaw9c'
  ],
  music: [
    'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'https://www.youtube.com/watch?v=5qap5aO4i9A'
  ],
  relaxation: [
    'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'https://www.youtube.com/watch?v=UfcAVejslrU'
  ]
};

export default liveStreams;