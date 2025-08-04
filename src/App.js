import React, { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Chat from './components/Chat';
import NicknameModal from './components/NicknameModal';
import Mascot from './components/Mascot';
import ChannelSelector from './components/ChannelSelector';
import ParticleSystem from './components/ParticleSystem';
import AdminPanel from './components/AdminPanel';
import LiveStreamSelector from './components/LiveStreamSelector';
import useStore from './store/useStore';
import useSocket from './hooks/useSocket';
import streamService from './services/streamService';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-cyan-400 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl mb-4">📺 RetroChat Live</h1>
            <p className="text-xl mb-4">Carregando a nostalgia...</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-cyan-600 hover:bg-cyan-700 text-black px-4 py-2 rounded"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App component initializing...');
  
  const { 
    nickname, 
    showNicknameModal, 
    chatVisible,
    addMessage 
  } = useStore();
  
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLiveStreamSelector, setShowLiveStreamSelector] = useState(false);
  const [appError, setAppError] = useState(null);
  
  // Inicializar socket com tratamento de erro
  let socket;
  try {
    socket = useSocket();
    console.log('Socket initialized successfully');
  } catch (error) {
    console.error('Socket initialization failed:', error);
    setAppError('Socket connection failed');
  }

  useEffect(() => {
    // Mensagem de boas-vindas quando a app carrega
    if (nickname && !showNicknameModal) {
      addMessage({
        type: 'system',
        text: '🎉 Bem-vindo ao RetroChat Live! A nostalgia dos anos 2000 está de volta!',
        nickname: 'Sistema',
        avatar: '🎮'
      });
      
      addMessage({
        type: 'system',
        text: '💡 Digite /help para ver todos os comandos disponíveis.',
        nickname: 'Sistema',
        avatar: '💡'
      });
    }
    
    // Atalhos de teclado
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminPanel(true);
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setShowLiveStreamSelector(true);
      }
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        setShowChannelSelector(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nickname, showNicknameModal, addMessage]);

  // Inicializar serviço de streams automático
  useEffect(() => {
    if (process.env.REACT_APP_ENABLE_STREAM_AUTOMATION === 'true') {
      const interval = parseInt(process.env.REACT_APP_STREAM_UPDATE_INTERVAL) || 30;
      streamService.startAutoUpdate(interval);
      console.log('🚀 Serviço de automação de streams iniciado');
    }

    return () => {
      streamService.stopAutoUpdate();
    };
  }, []);

  return (
    <div className="min-h-screen bg-retro-dark text-white crt-effect relative">
      {/* Particle System */}
      <ParticleSystem />
      
      {/* Header */}
      <header className="bg-retro-gray border-b-2 border-neon-cyan p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl animate-pulse">📺</div>
            <div>
              <h1 className="text-neon-cyan font-pixel text-xl neon-text">
                RETROCHAT LIVE
              </h1>
              <p className="text-neon-green text-xs font-pixel">
                TV Online • Anos 2000 • Nostalgia Garantida
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Channel selector button */}
            <button 
              onClick={() => setShowChannelSelector(true)}
              className="retro-button text-xs px-3 py-1"
              title="Selecionar Canal"
            >
              📺 CANAIS
            </button>
            
            {/* Live Stream selector button */}
            <button
              onClick={() => setShowLiveStreamSelector(true)}
              className="retro-button text-xs px-3 py-1"
              title="Streams ao Vivo (Ctrl+L)"
            >
              📺 STREAMS
            </button>
            
            {/* Admin panel button */}
            <button
              onClick={() => setShowAdminPanel(true)}
              className="retro-button text-xs px-3 py-1"
              title="Painel Admin (Ctrl+Shift+A)"
            >
              ⚙️ ADMIN
            </button>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-neon-green font-pixel text-xs">LIVE</span>
            </div>
            
            {/* Chat toggle for mobile */}
            <button 
              onClick={() => useStore.getState().toggleChat()}
              className="md:hidden retro-button text-xs px-3 py-1"
            >
              💬
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Video area */}
        <div className={`flex-1 transition-all duration-300 ${
          chatVisible ? 'md:mr-80' : ''
        }`}>
          <VideoPlayer />
        </div>

        {/* Chat sidebar */}
        <div className={`fixed md:relative top-0 right-0 h-full w-80 transform transition-transform duration-300 z-40 ${
          chatVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0'
        }`}>
          {chatVisible && <Chat />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-retro-gray border-t border-retro-border p-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-retro-border">
              © 2024 RetroChat Live
            </span>
            <span className="text-neon-cyan">
              Feito com 💾 e nostalgia
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-neon-cyan font-pixel">🎮 Diversão Garantida</span>
            <span className="text-retro-border">•</span>
            <span className="text-neon-pink font-pixel">24/7</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NicknameModal />
      <ChannelSelector 
        isOpen={showChannelSelector} 
        onClose={() => setShowChannelSelector(false)} 
      />
      
      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
      
      {showLiveStreamSelector && (
        <LiveStreamSelector
          isOpen={showLiveStreamSelector}
          onClose={() => setShowLiveStreamSelector(false)}
        />
      )}
      
      {/* Mascote Interativo */}
      {!showNicknameModal && <Mascot />}

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-neon-cyan rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-neon-pink rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-neon-green rounded-full animate-ping opacity-30"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Loading overlay for initial load */}
      {showNicknameModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-30">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <div className="text-neon-cyan font-pixel text-xl neon-text mb-2">
              RETROCHAT LIVE
            </div>
            <div className="text-white text-sm">
              Carregando a nostalgia<span className="loading-dots"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal com Error Boundary
function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;