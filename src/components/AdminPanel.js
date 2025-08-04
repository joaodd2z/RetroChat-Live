import React, { useState, useEffect } from 'react';
import { loginAdmin } from '../config/firebase';
import chatService from '../services/chatService';
import useStore from '../store/useStore';
import WordPressAutomation from './WordPressAutomation';
import streamService from '../services/streamService';

const AdminPanel = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatStats, setChatStats] = useState({});
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWordPressPanel, setShowWordPressPanel] = useState(false);
  const [streamStats, setStreamStats] = useState(null);
  const { currentChannel, setCurrentStream } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadChatStats();
      loadStreamStats();
    }
  }, [isAuthenticated, currentChannel]);

  const loadStreamStats = () => {
    const stats = streamService.getStats();
    setStreamStats(stats);
  };

  const loadChatStats = async () => {
    try {
      const stats = await chatService.getChatStats(currentChannel);
      setChatStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Verificar credenciais locais primeiro
      const adminUsername = process.env.REACT_APP_ADMIN_USERNAME || 'joaodd2';
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'Killer007@';
      
      if (credentials.username === adminUsername && credentials.password === adminPassword) {
        setIsAuthenticated(true);
      } else {
        alert('Credenciais inválidas!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login!');
    } finally {
      setLoading(false);
    }
  };

  const handleStreamUpdate = () => {
    if (streamUrl.trim()) {
      setCurrentStream(streamUrl);
      alert('Stream atualizada com sucesso!');
      setStreamUrl('');
    }
  };

  const handleChatCleanup = async () => {
    if (window.confirm('Tem certeza que deseja limpar mensagens antigas?')) {
      setLoading(true);
      try {
        await chatService.cleanOldMessages(currentChannel);
        await loadChatStats();
        alert('Limpeza concluída!');
      } catch (error) {
        console.error('Erro na limpeza:', error);
        alert('Erro ao limpar mensagens!');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🛠️ Painel Administrativo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Usuário:</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500"
                placeholder="joaodd2"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Senha:</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-700">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'stream', label: '📺 Stream', icon: '📺' },
                { id: 'chat', label: '💬 Chat', icon: '💬' },
                { id: 'settings', label: '⚙️ Configurações', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-4 ${activeTab === tab.id 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-lg font-semibold text-white mb-2">💬 Total de Mensagens</h3>
                    <p className="text-3xl font-bold text-blue-400">{chatStats.totalMessages || 0}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-lg font-semibold text-white mb-2">👥 Usuários Únicos</h3>
                    <p className="text-3xl font-bold text-green-400">{chatStats.uniqueUsers || 0}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-lg font-semibold text-white mb-2">🕒 Última Atividade</h3>
                    <p className="text-sm text-gray-300">{formatDate(chatStats.lastActivity)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="mr-2">📺</span>
                      Stream Service
                    </h3>
                    {streamStats ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Status:</span>
                          <span className={`font-bold ${
                            streamStats.isRunning ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {streamStats.isRunning ? '🟢 Ativo' : '🔴 Inativo'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Last Update:</span>
                          <span className="text-white text-sm">
                            {streamStats.lastUpdate ? 
                              new Date(streamStats.lastUpdate).toLocaleTimeString() : 'Never'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Failed Streams:</span>
                          <span className="text-white font-bold">{streamStats.failedStreamsCount}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Loading...</div>
                    )}
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="mr-2">⚡</span>
                      Ações Rápidas
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowWordPressPanel(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors text-sm"
                      >
                        🔗 WordPress Admin
                      </button>
                      <button
                        onClick={() => {
                          streamService.forceUpdate();
                          loadStreamStats();
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors text-sm"
                      >
                        🔄 Update Streams
                      </button>
                      <button
                        onClick={() => {
                          loadChatStats();
                          loadStreamStats();
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors text-sm"
                      >
                        📊 Refresh Stats
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-lg font-semibold text-white mb-4">🎯 Status do Sistema</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Firebase:</span>
                      <span className="text-green-400">✅ Conectado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Chat em Tempo Real:</span>
                      <span className="text-green-400">✅ Ativo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Canal Atual:</span>
                      <span className="text-blue-400">{currentChannel}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stream Tab */}
            {activeTab === 'stream' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-lg font-semibold text-white mb-4">📺 Gerenciar Stream</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">URL da Stream:</label>
                      <input
                        type="url"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <button
                      onClick={handleStreamUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                    >
                      🔄 Atualizar Stream
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-lg font-semibold text-white mb-4">⚡ Streams Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { name: '🏆 Futebol ao Vivo', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
                      { name: '🎵 Lofi Hip Hop', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
                      { name: '🌊 Relaxing Sounds', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
                      { name: '🎮 Gaming Stream', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' }
                    ].map((stream, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStream(stream.url)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded text-left"
                      >
                        {stream.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-lg font-semibold text-white mb-4">💬 Gerenciar Chat</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleChatCleanup}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Limpando...' : '🧹 Limpar Mensagens Antigas'}
                    </button>
                    <button
                      onClick={loadChatStats}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold ml-4"
                    >
                      🔄 Atualizar Estatísticas
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-lg font-semibold text-white mb-4">⚙️ Configurações do Sistema</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Histórico do Chat:</span>
                      <span className="text-green-400">✅ Habilitado</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Máximo de Mensagens:</span>
                      <span className="text-blue-400">{process.env.REACT_APP_MAX_CHAT_HISTORY || 1000}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Esportes ao Vivo:</span>
                      <span className="text-green-400">✅ Habilitado</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-lg font-semibold text-white mb-4">🔐 Segurança</h3>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                  >
                    🚪 Sair do Painel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* WordPress Automation Panel */}
        {showWordPressPanel && (
          <WordPressAutomation
            isOpen={showWordPressPanel}
            onClose={() => setShowWordPressPanel(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;