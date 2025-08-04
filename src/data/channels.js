// Lista de canais de entretenimento ao vivo
export const LIVE_CHANNELS = [
  {
    id: 'lofi-hip-hop',
    name: '🎵 Lofi Hip Hop Radio',
    description: 'Música relaxante 24/7 para estudar e trabalhar',
    type: 'youtube',
    videoId: 'jfKfPfyJRdk', // Lofi Girl
    category: 'música',
    viewers: '50K+',
    isLive: true
  },
  {
    id: 'synthwave-radio',
    name: '🌆 Synthwave Radio',
    description: 'Música eletrônica retrô dos anos 80',
    type: 'youtube',
    videoId: '4xDzrJKXOOY', // Synthwave radio
    category: 'música',
    viewers: '15K+',
    isLive: true
  },
  {
    id: 'nasa-earth',
    name: '🌍 NASA Earth Live',
    description: 'Vista da Terra ao vivo da Estação Espacial',
    type: 'youtube',
    videoId: 'XBPjVzSoepo', // NASA Live
    category: 'ciência',
    viewers: '25K+',
    isLive: true
  },
  {
    id: 'relaxing-nature',
    name: '🌲 Natureza Relaxante',
    description: 'Sons da natureza para relaxar',
    type: 'youtube',
    videoId: 'lE6RYpe9IT0', // Nature sounds
    category: 'relaxamento',
    viewers: '8K+',
    isLive: true
  },
  {
    id: 'retro-games',
    name: '🕹️ Retro Games 24/7',
    description: 'Gameplay de jogos clássicos',
    type: 'youtube',
    videoId: 'GhsblayWESs', // Retro gaming
    category: 'games',
    viewers: '12K+',
    isLive: true
  },
  {
    id: 'anime-music',
    name: '🎌 Anime Music Radio',
    description: 'As melhores trilhas sonoras de anime',
    type: 'youtube',
    videoId: 'WDnzcWOD4xU', // Anime music
    category: 'música',
    viewers: '20K+',
    isLive: true
  },
  {
    id: 'jazz-cafe',
    name: '☕ Jazz Café',
    description: 'Jazz suave para um ambiente aconchegante',
    type: 'youtube',
    videoId: 'Dx5qFachd3A', // Jazz music
    category: 'música',
    viewers: '18K+',
    isLive: true
  },
  {
    id: 'cyberpunk-radio',
    name: '🤖 Cyberpunk Radio',
    description: 'Música futurística e cyberpunk',
    type: 'youtube',
    videoId: 'r7lVgGHiPU8',
    category: 'música',
    viewers: '22K+',
    isLive: true
  },
  {
    id: 'mrbeast',
    name: '💰 MrBeast',
    description: 'Canal principal do MrBeast - Vídeos populares',
    type: 'youtube',
    videoId: 'TJ2ifmkGGus', // Um dos vídeos populares do MrBeast
    category: 'entretenimento',
    viewers: '300K+',
    isLive: true
  },
  {
    id: 'mrbeast-gaming',
    name: '🎮 MrBeast Gaming',
    description: 'Os melhores momentos do MrBeast Gaming',
    type: 'youtube',
    videoId: 'n6HxbSzGk44', // Vídeo popular do MrBeast Gaming
    category: 'entretenimento',
    viewers: '150K+',
    isLive: true
  },
  {
    id: 'universo-z',
    name: '🌌 Universo Z',
    description: 'Canal do Blast - Conteúdo sobre Dragon Ball e animes (parceria especial)',
    type: 'youtube',
    videoId: 'dQw4w9WgXcQ', // Placeholder - será substituído por busca do canal
    category: 'entretenimento',
    viewers: '45K+',
    isLive: true,
    featured: true,
    universoZ: true
  },
  {
    id: 'pewdiepie',
    name: '👑 PewDiePie',
    description: 'O rei do YouTube em ação',
    type: 'youtube',
    videoId: 'n4tK7LYFxI0', // Vídeo popular do PewDiePie
    category: 'entretenimento',
    viewers: '200K+',
    isLive: true
  },
  {
    id: 'rick-morty-telegram',
    name: '🛸 Rick & Morty Stream',
    description: 'Episódios de Rick and Morty via Telegram',
    type: 'telegram',
    url: 'https://t.me/c/1878478864/57475',
    category: 'entretenimento',
    viewers: 'Ativo',
    isLive: true
  },
  {
    id: 'yggdrasil-animes',
    name: '🌳 Yggdrasil Animes',
    description: 'Desenhos e animes via Telegram',
    type: 'telegram',
    url: 'https://t.me/YggdrasilAnimesgrupo',
    category: 'entretenimento',
    viewers: 'Ativo',
    isLive: true
  },
  {
    id: 'free-entertainment',
    name: '🎬 Entretenimento Gratuito',
    description: 'Acesso a entretenimento gratuito',
    type: 'external',
    url: 'https://suaads.com/27b2fe',
    category: 'entretenimento',
    viewers: 'Disponível',
    isLive: true
  },
  {
    id: 'study-music',
    name: '📚 Study Music 24/7',
    description: 'Música para concentração e estudos',
    type: 'youtube',
    videoId: '5qap5aO4i9A',
    category: 'música',
    viewers: '35K+',
    isLive: true
  },
  {
    id: 'minecraft-music',
    name: '⛏️ Minecraft Music',
    description: 'Trilha sonora relaxante do Minecraft',
    type: 'youtube',
    videoId: 'Dg0IjOzopYU',
    category: 'games',
    viewers: '28K+',
    isLive: true
  },
  {
    id: 'space-ambient',
    name: '🚀 Space Ambient',
    description: 'Sons do espaço para relaxar',
    type: 'youtube',
    videoId: 'V1Pl8CzNzCw',
    category: 'relaxamento',
    viewers: '18K+',
    isLive: true
  },
  {
    id: 'cnn-brasil',
    name: '📺 CNN Brasil',
    description: 'Notícias ao vivo 24 horas',
    type: 'youtube',
    videoId: 'Wt_Rx3Ca4XQ',
    category: 'notícias',
    viewers: '45K+',
    isLive: true
  },
  {
    id: 'sbt-news',
    name: '📰 SBT News',
    description: 'Jornalismo e notícias do SBT',
    type: 'youtube',
    videoId: 'bjGifZSsuNw',
    category: 'notícias',
    viewers: '32K+',
    isLive: true
  },
  {
    id: 'globo-news',
    name: '🌐 GloboNews',
    description: 'Canal de notícias da Globo ao vivo',
    type: 'youtube',
    videoId: 'NXWqXSJlrwU',
    category: 'notícias',
    viewers: '85K+',
    isLive: true
  },
  {
    id: 'band-news',
    name: '📻 BandNews',
    description: 'Notícias e jornalismo da Band',
    type: 'youtube',
    videoId: 'Y_PDIoB9wfI',
    category: 'notícias',
    viewers: '28K+',
    isLive: true
  },
  {
    id: 'record-news',
    name: '🔴 Record News',
    description: 'Canal de notícias da Record',
    type: 'youtube',
    videoId: 'G7nBDEGJBwY',
    category: 'notícias',
    viewers: '22K+',
    isLive: true
  },
  {
    id: 'tv-cultura',
    name: '🎭 TV Cultura',
    description: 'Programação cultural e educativa',
    type: 'youtube',
    videoId: 'K6I2laMN7Ys',
    category: 'cultura',
    viewers: '15K+',
    isLive: true
  },
  {
    id: 'tv-brasil',
    name: '🇧🇷 TV Brasil',
    description: 'Canal público brasileiro',
    type: 'youtube',
    videoId: 'f8mL0_4GeV0',
    category: 'cultura',
    viewers: '12K+',
    isLive: true
  },
  {
    id: 'jovem-pan-news',
    name: '📡 Jovem Pan News',
    description: 'Notícias e debates da Jovem Pan',
    type: 'youtube',
    videoId: 'qGS7y8Ixjzs',
    category: 'notícias',
    viewers: '38K+',
    isLive: true
  }
];

// Ferramentas integradas
export const EXTERNAL_PLATFORMS = [
  {
    id: 'youtube-search',
    name: '🔍 Buscar no YouTube',
    description: 'Pesquise e assista vídeos do YouTube aqui mesmo',
    icon: '🔍',
    type: 'youtube-search'
  },
  {
    id: 'random-video',
    name: '🎲 Vídeo Aleatório',
    description: 'Assista um vídeo aleatório dos nossos canais',
    icon: '🎲',
    type: 'random'
  },
  {
    id: 'trending',
    name: '🔥 Em Alta',
    description: 'Vídeos populares e em tendência',
    icon: '🔥',
    type: 'trending'
  }
];

// Categorias de canais
export const CHANNEL_CATEGORIES = [
  { id: 'todos', name: '🌟 Todos', icon: '🌟' },
  { id: 'música', name: '🎵 Música', icon: '🎵' },
  { id: 'games', name: '🕹️ Games', icon: '🕹️' },
  { id: 'ciência', name: '🔬 Ciência', icon: '🔬' },
  { id: 'relaxamento', name: '🧘 Relaxamento', icon: '🧘' },
  { id: 'entretenimento', name: '🎭 Entretenimento', icon: '🎭' },
  { id: 'notícias', name: '📰 Notícias', icon: '📰' },
  { id: 'cultura', name: '🎨 Cultura', icon: '🎨' }
];

// Função para obter canais por categoria
export const getChannelsByCategory = (category) => {
  if (category === 'todos') {
    return LIVE_CHANNELS;
  }
  return LIVE_CHANNELS.filter(channel => channel.category === category);
};

// Função para obter canal aleatório
export const getRandomChannel = () => {
  const randomIndex = Math.floor(Math.random() * LIVE_CHANNELS.length);
  return LIVE_CHANNELS[randomIndex];
};