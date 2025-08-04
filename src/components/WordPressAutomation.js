import React, { useState, useEffect } from 'react';
import { WPAdminManager } from '../config/wpAdmin';
import streamService from '../services/streamService';
import { getAllStreams } from '../data/liveStreams';

const WordPressAutomation = ({ isOpen, onClose }) => {
  const [wpManager] = useState(new WPAdminManager());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncStats, setSyncStats] = useState({ posts: 0, errors: 0 });
  const [logs, setLogs] = useState([]);

  if (!isOpen) return null;

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Manter apenas 50 logs
  };

  const connectToWordPress = async () => {
    setIsConnecting(true);
    addLog('🔄 Conectando ao WordPress...', 'info');
    
    try {
      const success = await wpManager.authenticate();
      if (success) {
        setIsConnected(true);
        addLog('✅ Conectado ao WordPress com sucesso!', 'success');
      } else {
        addLog('❌ Falha na conexão com WordPress', 'error');
      }
    } catch (error) {
      addLog(`❌ Erro: ${error.message}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const syncStreamsToWordPress = async () => {
    if (!isConnected) {
      addLog('⚠️ Conecte-se ao WordPress primeiro', 'warning');
      return;
    }

    addLog('🔄 Sincronizando streams com WordPress...', 'info');
    const streams = getAllStreams().filter(stream => stream.isLive);
    let postsCreated = 0;
    let errors = 0;

    for (const stream of streams) {
      try {
        const template = stream.category === 'Futebol' ? 'footballMatch' : 
                        stream.category === 'Música' ? 'musicStream' : 'liveStream';
        
        const post = await wpManager.createPost(stream, template);
        if (post) {
          postsCreated++;
          addLog(`✅ Post criado: ${stream.name}`, 'success');
        } else {
          errors++;
          addLog(`❌ Erro ao criar post: ${stream.name}`, 'error');
        }
      } catch (error) {
        errors++;
        addLog(`❌ Erro: ${error.message}`, 'error');
      }
    }

    setSyncStats({ posts: postsCreated, errors });
    setLastSync(new Date());
    addLog(`📊 Sincronização concluída: ${postsCreated} posts, ${errors} erros`, 'info');
  };

  const startAutomation = () => {
    setAutomationEnabled(true);
    addLog('🚀 Automação WordPress iniciada', 'success');
    
    // Sincronizar a cada 30 minutos
    const interval = setInterval(() => {
      if (isConnected) {
        syncStreamsToWordPress();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  };

  const stopAutomation = () => {
    setAutomationEnabled(false);
    addLog('⏹️ Automação WordPress parada', 'warning');
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">🔗</span>
            Automação WordPress
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
          {/* Painel de Controle */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">🎛️ Controles</h3>
            
            {/* Status da Conexão */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Status WordPress:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
                </span>
              </div>
              
              {!isConnected && (
                <button
                  onClick={connectToWordPress}
                  disabled={isConnecting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  {isConnecting ? '🔄 Conectando...' : '🔗 Conectar WordPress'}
                </button>
              )}
            </div>

            {/* Configurações */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">⚙️ Configurações</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Usuário:</span>
                  <span className="text-white text-sm font-mono">joaodd2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Automação:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    automationEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {automationEnabled ? '🟢 Ativa' : '⚪ Inativa'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Última Sync:</span>
                  <span className="text-white text-xs">
                    {lastSync ? lastSync.toLocaleTimeString() : 'Nunca'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <button
                onClick={syncStreamsToWordPress}
                disabled={!isConnected}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                🔄 Sincronizar Agora
              </button>
              
              {!automationEnabled ? (
                <button
                  onClick={startAutomation}
                  disabled={!isConnected}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  🚀 Iniciar Automação
                </button>
              ) : (
                <button
                  onClick={stopAutomation}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  ⏹️ Parar Automação
                </button>
              )}
            </div>

            {/* Estatísticas */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-white font-medium mb-3">📊 Estatísticas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{syncStats.posts}</div>
                  <div className="text-xs text-gray-300">Posts Criados</div>
                </div>
                <div className="bg-gray-700 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{syncStats.errors}</div>
                  <div className="text-xs text-gray-300">Erros</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">📋 Logs</h3>
              <button
                onClick={() => setLogs([])}
                className="text-gray-400 hover:text-white text-sm"
              >
                🗑️ Limpar
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto bg-gray-900 rounded p-3 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  📝 Nenhum log ainda...
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="mb-2 flex items-start">
                    <span className="mr-2">{getLogIcon(log.type)}</span>
                    <span className="text-gray-400 text-xs mr-2 mt-0.5">
                      {log.timestamp}
                    </span>
                    <span className={getLogColor(log.type)}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>
              💡 A automação criará posts no WordPress para cada stream ativa
            </div>
            <div>
              🔄 Sincronização automática a cada 30 minutos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressAutomation;