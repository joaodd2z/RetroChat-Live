import React, { useState, useCallback, useMemo } from 'react';
import { CHANNEL_CATEGORIES, getChannelsByCategory, getRandomChannel } from '../data/channels';
import useStore from '../store/useStore';

const ChannelSelector = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setCurrentVideo, addMessage } = useStore();

  const filteredChannels = useMemo(() => getChannelsByCategory(selectedCategory), [selectedCategory]);

  const handleChannelSelect = useCallback((channel) => {
    // Canal do YouTube normal
    setCurrentVideo({
      id: channel.videoId,
      title: channel.name,
      type: channel.type,
      description: channel.description
    });
    
    addMessage({
      type: 'system',
      text: `📺 Canal alterado para: ${channel.name}`,
      nickname: 'Sistema',
      avatar: '📺'
    });
    
    onClose();
  }, [setCurrentVideo, addMessage, onClose]);

  const handleRandomChannel = useCallback(() => {
    const randomChannel = getRandomChannel();
    handleChannelSelect(randomChannel);
  }, [handleChannelSelect]);

  const handleToolSelect = useCallback((tool) => {
    switch (tool.type) {
      case 'youtube-search':
        setShowYouTubeSearch(true);
        addMessage({
          type: 'system',
          text: '🔍 Modo de busca do YouTube ativado! Digite sua pesquisa.',
          nickname: 'Sistema',
          avatar: '🔍'
        });
        break;
      case 'random':
        handleRandomChannel();
        break;
      case 'trending':
        // Implementar vídeos em alta
        const trendingVideos = [
          { videoId: 'dQw4w9WgXcQ', title: '🔥 Rick Astley - Never Gonna Give You Up', type: 'youtube' },
          { videoId: 'kJQP7kiw5Fk', title: '🔥 Despacito - Luis Fonsi ft. Daddy Yankee', type: 'youtube' },
          { videoId: 'fJ9rUzIMcZQ', title: '🔥 Queen - Bohemian Rhapsody', type: 'youtube' }
        ];
        const randomTrending = trendingVideos[Math.floor(Math.random() * trendingVideos.length)];
        setCurrentVideo({
          id: randomTrending.videoId,
          title: randomTrending.title,
          type: randomTrending.type,
          description: 'Vídeo em alta selecionado aleatoriamente'
        });
        addMessage({
          type: 'system',
          text: `🔥 Reproduzindo vídeo em alta: ${randomTrending.title}`,
          nickname: 'Sistema',
          avatar: '🔥'
        });
        onClose();
        break;
      default:
        break;
    }
  }, [setCurrentVideo, addMessage, onClose, handleRandomChannel]);

  const handleYouTubeSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    // Simular busca do YouTube (em produção, usar YouTube API)
    const mockResults = [
      { videoId: 'dQw4w9WgXcQ', title: `🎵 ${query} - Resultado 1`, type: 'youtube' },
      { videoId: 'kJQP7kiw5Fk', title: `🎬 ${query} - Resultado 2`, type: 'youtube' },
      { videoId: 'fJ9rUzIMcZQ', title: `📺 ${query} - Resultado 3`, type: 'youtube' }
    ];
    
    const selectedResult = mockResults[0]; // Pegar primeiro resultado
    
    setCurrentVideo({
      id: selectedResult.videoId,
      title: selectedResult.title,
      type: selectedResult.type,
      description: `Resultado da busca: ${query}`
    });
    
    addMessage({
      type: 'system',
      text: `🔍 Reproduzindo resultado da busca "${query}": ${selectedResult.title}`,
      nickname: 'Sistema',
      avatar: '🔍'
    });
    
    setShowYouTubeSearch(false);
    setSearchQuery('');
    onClose();
  }, [setCurrentVideo, addMessage, onClose, setShowYouTubeSearch, setSearchQuery]);



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-retro-dark border-2 border-neon-cyan rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-retro-gray border-b border-retro-border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📺</span>
            <div>
              <h2 className="text-neon-cyan font-pixel text-lg neon-text">
                SELETOR DE CANAIS
              </h2>
              <p className="text-white text-sm">
                Escolha seu entretenimento favorito!
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose}
            className="text-retro-border hover:text-neon-cyan transition-colors text-xl"
          >
            ✕
          </button>
        </div>



        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Categories */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {CHANNEL_CATEGORIES.map(category => (
                <button
                  key={`category-${category.id}`}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded font-pixel text-xs transition-all ${
                    selectedCategory === category.id
                      ? 'bg-neon-cyan text-black'
                      : 'bg-retro-gray text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/20'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
            
            {/* Random Channel Button */}
            <button
              type="button"
              onClick={handleRandomChannel}
              className="w-full mb-4 p-3 bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 border-2 border-neon-pink rounded-lg hover:from-neon-pink/30 hover:to-neon-cyan/30 transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl animate-spin">🎲</span>
                <span className="text-neon-pink font-pixel">CANAL ALEATÓRIO</span>
              </div>
            </button>
          </div>

          {/* Live Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredChannels.map(channel => {
              const isUniversoZ = Boolean(channel.universoZ);
              return (
                <div
                  key={`channel-${channel.id}`}
                  onClick={() => handleChannelSelect(channel)}
                  className={`${
                    isUniversoZ
                      ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30'
                      : 'bg-retro-gray border border-retro-border'
                  } rounded-lg p-4 cursor-pointer hover:border-neon-cyan hover:bg-retro-gray/80 transition-all group relative overflow-hidden`}
                >
                  {isUniversoZ && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded-bl-lg z-20">
                      EXCLUSIVO
                    </div>
                  )}
                  {isUniversoZ && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent z-10"></div>
                  )}
                  <div className="flex items-start space-x-3 relative z-30">
                    <div className={`text-2xl ${
                      isUniversoZ ? '' : 'group-hover:animate-pulse'
                    }`}>
                      {isUniversoZ ? '🌟' : '📺'}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-pixel text-sm mb-1 group-hover:neon-text ${
                        channel.universoZ ? 'text-yellow-300 font-bold' : 'text-neon-cyan'
                      }`}>
                        {channel.name}
                      </h3>
                      <p className={`text-xs mb-2 line-clamp-2 ${
                        channel.universoZ ? 'text-yellow-100 font-semibold' : 'text-white'
                      }`}>
                        {channel.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-pixel ${
                          channel.universoZ ? 'text-yellow-300' : 'text-neon-green'
                        }`}>
                          👥 {channel.viewers}
                        </span>
                        {channel.isLive && (
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              channel.universoZ ? 'bg-yellow-400' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-xs font-pixel ${
                              channel.universoZ ? 'text-yellow-400' : 'text-red-500'
                            }`}>LIVE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ferramentas Integradas */}
          <div className="mb-4">
            <h3 className="text-neon-pink font-pixel text-lg mb-2 neon-text">
              🛠️ FERRAMENTAS INTEGRADAS
            </h3>
            
            {/* Busca do YouTube */}
            {showYouTubeSearch ? (
              <div className="mb-4 p-4 bg-retro-dark border border-neon-cyan rounded-lg">
                <h4 className="text-neon-cyan font-pixel text-md mb-3">🔍 Buscar no YouTube</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleYouTubeSearch(searchQuery)}
                    placeholder="Digite sua pesquisa..."
                    className="flex-1 bg-black border border-retro-border rounded px-3 py-2 text-white font-pixel text-sm focus:border-neon-cyan outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleYouTubeSearch(searchQuery)}
                    className="bg-neon-cyan text-retro-dark px-4 py-2 rounded font-pixel text-sm hover:bg-neon-cyan/80 transition-colors"
                  >
                    🔍 BUSCAR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowYouTubeSearch(false);
                      setSearchQuery('');
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded font-pixel text-sm hover:bg-red-700 transition-colors"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleToolSelect({ type: 'youtube-search' })}
                className="w-full p-3 bg-red-600 border border-red-500 rounded-lg hover:bg-red-700 transition-all group"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🔍</span>
                  <span className="text-white font-pixel">BUSCAR NO YOUTUBE</span>
                </div>
              </button>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-neon-yellow/10 border border-neon-yellow rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-neon-yellow text-lg">⚠️</span>
              <div>
                <h4 className="text-neon-yellow font-pixel text-sm mb-1">IMPORTANTE:</h4>
                <p className="text-white text-xs">
                  Todos os canais são transmissões ao vivo legais do YouTube. 
                  O RetroChat Live oferece uma experiência integrada de entretenimento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-retro-gray border-t border-retro-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-retro-border">
              {filteredChannels.length} canais disponíveis
            </span>
            <span className="text-neon-cyan font-pixel">
              🎮 Diversão garantida 24/7!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSelector;