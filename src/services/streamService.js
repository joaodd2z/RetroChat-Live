// Serviço para gerenciar streams ao vivo automaticamente
import { liveStreams, backupStreams } from '../data/liveStreams';

class StreamService {
  constructor() {
    this.updateInterval = null;
    this.isUpdating = false;
    this.lastUpdate = null;
    this.failedStreams = new Set();
  }

  // Inicia o serviço de atualização automática
  startAutoUpdate(intervalMinutes = 30) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.updateAllStreams();
    }, intervalMinutes * 60 * 1000);

    // Primeira atualização imediata
    this.updateAllStreams();
    
    console.log(`🔄 Serviço de streams iniciado - Atualização a cada ${intervalMinutes} minutos`);
  }

  // Para o serviço de atualização
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏹️ Serviço de streams parado');
    }
  }

  // Atualiza todas as streams
  async updateAllStreams() {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    this.lastUpdate = new Date();
    
    try {
      console.log('🔄 Atualizando streams...');
      
      // Atualizar streams de futebol
      await this.updateFootballStreams();
      
      // Atualizar outras streams
      await this.updateMusicStreams();
      await this.updateRelaxationStreams();
      
      console.log('✅ Streams atualizadas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar streams:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  // Atualiza streams de futebol com jogos ao vivo
  async updateFootballStreams() {
    const footballAPIs = [
      // APIs gratuitas para jogos de futebol
      'https://api.football-data.org/v4/matches',
      'https://www.thesportsdb.com/api/v1/json/3/livescore.php?l=4328', // Premier League
      'https://www.thesportsdb.com/api/v1/json/3/livescore.php?l=4331'  // Brasileirão
    ];

    try {
      // Simular busca de jogos ao vivo (implementar com APIs reais)
      const liveMatches = await this.fetchLiveMatches();
      
      if (liveMatches.length > 0) {
        // Atualizar streams de futebol com jogos reais
        this.updateFootballStreamsWithMatches(liveMatches);
      } else {
        // Usar streams de backup
        this.useBackupFootballStreams();
      }
    } catch (error) {
      console.warn('⚠️ Erro ao buscar jogos ao vivo, usando streams de backup');
      this.useBackupFootballStreams();
    }
  }

  // Busca jogos ao vivo (simulado - implementar com APIs reais)
  async fetchLiveMatches() {
    // Simulação de jogos ao vivo
    const mockMatches = [
      {
        id: 'match-1',
        homeTeam: 'Flamengo',
        awayTeam: 'Palmeiras',
        competition: 'Brasileirão',
        status: 'LIVE',
        streamUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
      },
      {
        id: 'match-2',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        competition: 'La Liga',
        status: 'LIVE',
        streamUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
      }
    ];

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retornar jogos aleatoriamente para simular variabilidade
    return Math.random() > 0.3 ? mockMatches : [];
  }

  // Atualiza streams com jogos reais
  updateFootballStreamsWithMatches(matches) {
    matches.forEach((match, index) => {
      if (index < liveStreams.sports.football.length) {
        liveStreams.sports.football[index] = {
          ...liveStreams.sports.football[index],
          name: `⚽ ${match.homeTeam} vs ${match.awayTeam}`,
          description: `${match.competition} - AO VIVO`,
          url: match.streamUrl,
          isLive: true,
          matchData: match
        };
      }
    });
  }

  // Usa streams de backup para futebol
  useBackupFootballStreams() {
    const backupFootballStreams = [
      {
        name: '⚽ Futebol 24/7',
        description: 'Melhores momentos e jogos clássicos',
        url: backupStreams.football[0]
      },
      {
        name: '🏆 Champions League',
        description: 'Highlights e análises',
        url: backupStreams.football[1]
      },
      {
        name: '🇧🇷 Brasileirão',
        description: 'Gols e lances do campeonato',
        url: backupStreams.football[2]
      }
    ];

    backupFootballStreams.forEach((stream, index) => {
      if (index < liveStreams.sports.football.length) {
        liveStreams.sports.football[index] = {
          ...liveStreams.sports.football[index],
          ...stream,
          isLive: true
        };
      }
    });
  }

  // Atualiza streams de música
  async updateMusicStreams() {
    const musicStreams = [
      {
        name: '🎵 Lofi Hip Hop 24/7',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        description: 'Música relaxante para estudar e trabalhar'
      },
      {
        name: '🎶 Top Hits Brasil',
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
        description: 'Os maiores sucessos da música brasileira'
      }
    ];

    musicStreams.forEach((stream, index) => {
      if (index < liveStreams.entertainment.music.length) {
        liveStreams.entertainment.music[index] = {
          ...liveStreams.entertainment.music[index],
          ...stream,
          isLive: true
        };
      }
    });
  }

  // Atualiza streams de relaxamento
  async updateRelaxationStreams() {
    const relaxationStreams = [
      {
        name: '🌊 Sons do Oceano',
        url: 'https://www.youtube.com/watch?v=UfcAVejslrU',
        description: 'Sons relaxantes do mar para meditação'
      },
      {
        name: '🔥 Lareira Aconchegante',
        url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
        description: 'Lareira virtual com sons crepitantes'
      }
    ];

    relaxationStreams.forEach((stream, index) => {
      if (index < liveStreams.entertainment.relaxation.length) {
        liveStreams.entertainment.relaxation[index] = {
          ...liveStreams.entertainment.relaxation[index],
          ...stream,
          isLive: true
        };
      }
    });
  }

  // Verifica se uma stream está funcionando
  async checkStreamHealth(streamUrl) {
    try {
      // Implementar verificação real de stream
      // Por enquanto, simular verificação
      return Math.random() > 0.1; // 90% de chance de estar funcionando
    } catch (error) {
      return false;
    }
  }

  // Obtém estatísticas do serviço
  getStats() {
    return {
      isRunning: !!this.updateInterval,
      lastUpdate: this.lastUpdate,
      failedStreamsCount: this.failedStreams.size,
      isUpdating: this.isUpdating
    };
  }

  // Força atualização manual
  async forceUpdate() {
    await this.updateAllStreams();
  }

  // Obtém stream recomendada baseada no horário
  getRecommendedStream() {
    const hour = new Date().getHours();
    
    // Manhã: música relaxante
    if (hour >= 6 && hour < 12) {
      return liveStreams.entertainment.music[0];
    }
    
    // Tarde: futebol ou esportes
    if (hour >= 12 && hour < 18) {
      return liveStreams.sports.football[0];
    }
    
    // Noite: relaxamento
    if (hour >= 18 || hour < 6) {
      return liveStreams.entertainment.relaxation[0];
    }
    
    return liveStreams.sports.football[0];
  }
}

// Instância singleton
const streamService = new StreamService();

export default streamService;
export { StreamService };