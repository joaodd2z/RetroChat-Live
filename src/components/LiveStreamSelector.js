import React, { useState } from 'react';
import { liveStreams, getAllStreams, getStreamsByCategory } from '../data/liveStreams';
import { useStore } from '../store/useStore';

const LiveStreamSelector = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('sports');
  const [activeSubcategory, setActiveSubcategory] = useState('football');
  const { setCurrentStream } = useStore();

  if (!isOpen) return null;

  const handleStreamSelect = (stream) => {
    setCurrentStream(stream.url);
    onClose();
  };

  const categories = {
    sports: {
      name: '🏆 Esportes',
      subcategories: {
        football: { name: '⚽ Futebol', streams: liveStreams.sports.football },
        basketball: { name: '🏀 Basquete', streams: liveStreams.sports.basketball },
        volleyball: { name: '🏐 Vôlei', streams: liveStreams.sports.volleyball }
      }
    },
    entertainment: {
      name: '🎭 Entretenimento',
      subcategories: {
        music: { name: '🎵 Música', streams: liveStreams.entertainment.music },
        gaming: { name: '🎮 Gaming', streams: liveStreams.entertainment.gaming },
        relaxation: { name: '🌊 Relaxamento', streams: liveStreams.entertainment.relaxation }
      }
    }
  };

  const currentStreams = categories[activeCategory]?.subcategories[activeSubcategory]?.streams || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📺 Streams ao Vivo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Sidebar de Categorias */}
          <div className="w-64 bg-gray-800 rounded-l-lg p-4 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">Categorias</h3>
            
            {Object.entries(categories).map(([categoryKey, category]) => (
              <div key={categoryKey} className="mb-4">
                <button
                  onClick={() => {
                    setActiveCategory(categoryKey);
                    setActiveSubcategory(Object.keys(category.subcategories)[0]);
                  }}
                  className={`w-full text-left p-3 rounded mb-2 transition-colors ${
                    activeCategory === categoryKey
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
                
                {activeCategory === categoryKey && (
                  <div className="ml-4 space-y-1">
                    {Object.entries(category.subcategories).map(([subKey, subcategory]) => (
                      <button
                        key={subKey}
                        onClick={() => setActiveSubcategory(subKey)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          activeSubcategory === subKey
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Área Principal de Streams */}
          <div className="flex-1 bg-gray-800 rounded-r-lg p-6 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                {categories[activeCategory]?.subcategories[activeSubcategory]?.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {currentStreams.length} stream(s) disponível(is)
              </p>
            </div>

            {currentStreams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📺</div>
                <p className="text-gray-400">Nenhuma stream disponível nesta categoria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => handleStreamSelect(stream)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold text-sm">{stream.name}</h4>
                      {stream.isLive && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          🔴 AO VIVO
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                      {stream.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                        {stream.category}
                      </span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors">
                        ▶️ Assistir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé com Ações Rápidas */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              💡 Dica: Use Ctrl+L para abrir rapidamente
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const randomStreams = getAllStreams().filter(s => s.isLive);
                  if (randomStreams.length > 0) {
                    const randomStream = randomStreams[Math.floor(Math.random() * randomStreams.length)];
                    handleStreamSelect(randomStream);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                🎲 Stream Aleatória
              </button>
              <button
                onClick={() => {
                  const footballStreams = liveStreams.sports.football.filter(s => s.isLive);
                  if (footballStreams.length > 0) {
                    handleStreamSelect(footballStreams[0]);
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                ⚽ Futebol Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamSelector;