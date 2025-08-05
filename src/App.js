import React, { useEffect, useState } from 'react';
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
            <p className="text-xl mb-4">Erro detectado. Recarregando...</p>
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

// Simple fallback components
const VideoPlayerFallback = () => (
  <div className="w-full h-full bg-black flex items-center justify-center">
    <div className="text-center text-white">
      <div className="text-6xl mb-4">📺</div>
      <h2 className="text-2xl mb-2">RetroChat Live</h2>
      <p className="text-gray-400">Player de vídeo carregando...</p>
    </div>
  </div>
);

const ChatFallback = () => (
  <div className="w-full h-full bg-gray-900 border-l border-gray-700 flex items-center justify-center">
    <div className="text-center text-white">
      <div className="text-4xl mb-4">💬</div>
      <p className="text-gray-400">Chat carregando...</p>
    </div>
  </div>
);

function App() {
  console.log('🚀 RetroChat Live - App iniciando...');
  
  const [isLoading, setIsLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);

  useEffect(() => {
    console.log('⏱️ Configurando timer de carregamento...');
    const timer = setTimeout(() => {
      console.log('✅ Carregamento concluído!');
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <div className="text-cyan-400 text-2xl mb-2 font-bold">
            RETROCHAT LIVE
          </div>
          <div className="text-white text-sm">
            Carregando a nostalgia<span className="animate-pulse">...</span>
          </div>
          <div className="mt-4">
            <div className="w-48 h-2 bg-gray-800 rounded-full mx-auto">
              <div className="h-2 bg-cyan-400 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="bg-gray-900 border-b-2 border-cyan-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl animate-pulse">📺</div>
            <div>
              <h1 className="text-cyan-400 text-xl font-bold">
                RETROCHAT LIVE
              </h1>
              <p className="text-green-400 text-xs">
                TV Online • Anos 2000 • Nostalgia Garantida
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Chat toggle */}
            <button 
              onClick={() => setChatVisible(!chatVisible)}
              className="bg-cyan-600 hover:bg-cyan-700 text-black px-3 py-1 rounded text-xs font-bold"
            >
              {chatVisible ? '🙈 OCULTAR CHAT' : '💬 MOSTRAR CHAT'}
            </button>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-bold">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Video area */}
        <div className={`flex-1 transition-all duration-300 ${
          chatVisible ? 'md:mr-80' : ''
        }`}>
          <VideoPlayerFallback />
        </div>

        {/* Chat sidebar */}
        {chatVisible && (
          <div className="w-80 border-l border-gray-700">
            <ChatFallback />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 p-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              © 2024 RetroChat Live
            </span>
            <span className="text-cyan-400">
              Feito com 💾 e nostalgia
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400">🎮 Diversão Garantida</span>
            <span className="text-gray-400">•</span>
            <span className="text-pink-400">24/7</span>
          </div>
        </div>
      </footer>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
      </div>
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