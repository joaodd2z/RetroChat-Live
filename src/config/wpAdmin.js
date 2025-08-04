// Configuração do WordPress Admin
export const wpAdminConfig = {
  // Credenciais de acesso
  credentials: {
    username: process.env.REACT_APP_WP_ADMIN_USER || 'joaodd2',
    password: process.env.REACT_APP_WP_ADMIN_PASS || 'Killer007@',
    loginUrl: process.env.REACT_APP_WP_LOGIN_URL || '/wp-admin',
    apiUrl: process.env.REACT_APP_WP_API_URL || '/wp-json/wp/v2'
  },

  // Configurações de automação
  automation: {
    autoPublish: true,
    scheduleInterval: 30, // minutos
    categories: {
      streams: 'streams-ao-vivo',
      football: 'futebol',
      entertainment: 'entretenimento',
      music: 'musica',
      relaxation: 'relaxamento'
    },
    tags: {
      live: 'ao-vivo',
      football: 'futebol',
      sports: 'esportes',
      music: 'musica',
      entertainment: 'entretenimento'
    }
  },

  // Templates de posts
  postTemplates: {
    liveStream: {
      title: '🔴 AO VIVO: {streamName}',
      content: `
        <div class="live-stream-post">
          <h2>🔴 Transmissão ao Vivo</h2>
          <p><strong>Stream:</strong> {streamName}</p>
          <p><strong>Categoria:</strong> {category}</p>
          <p><strong>Descrição:</strong> {description}</p>
          
          <div class="stream-embed">
            <iframe width="100%" height="400" src="{embedUrl}" frameborder="0" allowfullscreen></iframe>
          </div>
          
          <div class="stream-info">
            <p>🕒 <strong>Início:</strong> {startTime}</p>
            <p>👥 <strong>Espectadores:</strong> <span id="viewer-count">Carregando...</span></p>
            <p>💬 <strong>Chat:</strong> <a href="{chatUrl}" target="_blank">Participar do Chat</a></p>
          </div>
          
          <div class="related-streams">
            <h3>🎯 Outras Streams Disponíveis</h3>
            <ul>
              {relatedStreams}
            </ul>
          </div>
        </div>
      `,
      status: 'publish',
      format: 'video'
    },
    
    footballMatch: {
      title: '⚽ {homeTeam} vs {awayTeam} - {competition}',
      content: `
        <div class="football-match-post">
          <h2>⚽ Jogo ao Vivo</h2>
          
          <div class="match-header">
            <div class="teams">
              <span class="home-team">{homeTeam}</span>
              <span class="vs">VS</span>
              <span class="away-team">{awayTeam}</span>
            </div>
            <div class="competition">{competition}</div>
            <div class="match-time">{matchTime}</div>
          </div>
          
          <div class="stream-embed">
            <iframe width="100%" height="400" src="{embedUrl}" frameborder="0" allowfullscreen></iframe>
          </div>
          
          <div class="match-info">
            <p>🏟️ <strong>Estádio:</strong> {stadium}</p>
            <p>📅 <strong>Data:</strong> {matchDate}</p>
            <p>⏰ <strong>Horário:</strong> {matchTime}</p>
            <p>📺 <strong>Transmissão:</strong> Ao vivo no RetroChat Live</p>
          </div>
          
          <div class="match-stats">
            <h3>📊 Estatísticas do Jogo</h3>
            <div id="live-stats">Carregando estatísticas...</div>
          </div>
        </div>
      `,
      status: 'publish',
      format: 'video'
    },
    
    musicStream: {
      title: '🎵 {streamName} - Música ao Vivo',
      content: `
        <div class="music-stream-post">
          <h2>🎵 Música ao Vivo</h2>
          
          <div class="stream-embed">
            <iframe width="100%" height="400" src="{embedUrl}" frameborder="0" allowfullscreen></iframe>
          </div>
          
          <div class="music-info">
            <p>🎼 <strong>Gênero:</strong> {genre}</p>
            <p>🎤 <strong>Artista/Canal:</strong> {artist}</p>
            <p>⏱️ <strong>Duração:</strong> 24/7</p>
            <p>🎧 <strong>Qualidade:</strong> HD</p>
          </div>
          
          <div class="playlist">
            <h3>🎶 Playlist Atual</h3>
            <div id="current-playlist">Carregando playlist...</div>
          </div>
        </div>
      `,
      status: 'publish',
      format: 'audio'
    }
  },

  // Configurações de SEO
  seo: {
    defaultMetaDescription: 'Assista transmissões ao vivo no RetroChat Live - Futebol, música, entretenimento e muito mais!',
    keywords: ['ao vivo', 'stream', 'futebol', 'música', 'entretenimento', 'chat', 'transmissão'],
    ogImage: '/assets/retro-live-og.jpg',
    twitterCard: 'summary_large_image'
  },

  // Configurações de notificação
  notifications: {
    email: {
      enabled: true,
      recipients: ['joaodd2@example.com'],
      templates: {
        newStream: 'Nova stream iniciada: {streamName}',
        streamEnded: 'Stream finalizada: {streamName}',
        error: 'Erro na automação: {errorMessage}'
      }
    },
    webhook: {
      enabled: false,
      url: process.env.REACT_APP_WEBHOOK_URL,
      events: ['stream_start', 'stream_end', 'error']
    }
  }
};

// Classe para gerenciar WordPress Admin
export class WPAdminManager {
  constructor(config = wpAdminConfig) {
    this.config = config;
    this.isAuthenticated = false;
    this.authToken = null;
  }

  // Autentica no WordPress
  async authenticate() {
    try {
      const response = await fetch(`${this.config.credentials.apiUrl}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.config.credentials.username,
          password: this.config.credentials.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.token;
        this.isAuthenticated = true;
        console.log('✅ Autenticado no WordPress com sucesso');
        return true;
      } else {
        console.error('❌ Erro na autenticação WordPress');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com WordPress:', error);
      return false;
    }
  }

  // Cria um post automaticamente
  async createPost(streamData, template = 'liveStream') {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const postTemplate = this.config.postTemplates[template];
    if (!postTemplate) {
      throw new Error(`Template '${template}' não encontrado`);
    }

    const postData = {
      title: this.replaceTemplateVars(postTemplate.title, streamData),
      content: this.replaceTemplateVars(postTemplate.content, streamData),
      status: postTemplate.status,
      format: postTemplate.format,
      categories: this.getCategoriesForStream(streamData),
      tags: this.getTagsForStream(streamData),
      meta: {
        stream_url: streamData.url,
        stream_id: streamData.id,
        is_live: streamData.isLive
      }
    };

    try {
      const response = await fetch(`${this.config.credentials.apiUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const post = await response.json();
        console.log(`✅ Post criado: ${post.title.rendered}`);
        return post;
      } else {
        console.error('❌ Erro ao criar post');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao criar post:', error);
      return null;
    }
  }

  // Substitui variáveis no template
  replaceTemplateVars(template, data) {
    let result = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, data[key] || '');
    });
    return result;
  }

  // Obtém categorias para a stream
  getCategoriesForStream(streamData) {
    const categories = [];
    
    if (streamData.category) {
      const categoryMap = this.config.automation.categories;
      const categoryKey = streamData.category.toLowerCase();
      
      if (categoryMap[categoryKey]) {
        categories.push(categoryMap[categoryKey]);
      }
    }
    
    return categories;
  }

  // Obtém tags para a stream
  getTagsForStream(streamData) {
    const tags = [this.config.automation.tags.live];
    
    if (streamData.category) {
      const tagMap = this.config.automation.tags;
      const categoryKey = streamData.category.toLowerCase();
      
      if (tagMap[categoryKey]) {
        tags.push(tagMap[categoryKey]);
      }
    }
    
    return tags;
  }

  // Atualiza post existente
  async updatePost(postId, streamData) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.config.credentials.apiUrl}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          meta: {
            stream_url: streamData.url,
            is_live: streamData.isLive,
            last_updated: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        console.log(`✅ Post ${postId} atualizado`);
        return true;
      } else {
        console.error(`❌ Erro ao atualizar post ${postId}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar post:', error);
      return false;
    }
  }

  // Remove posts de streams que não estão mais ao vivo
  async cleanupOldPosts() {
    // Implementar limpeza de posts antigos
    console.log('🧹 Limpando posts antigos...');
  }
}

export default wpAdminConfig;