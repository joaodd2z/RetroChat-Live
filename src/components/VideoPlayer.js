import React, { useEffect, useRef, useState, useCallback } from 'react';
import useStore from '../store/useStore';

const VideoPlayer = () => {
  const { currentVideo } = useStore();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setIsPlayerReady] = useState(false);

  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch (err) {
        console.warn('Erro ao destruir player:', err);
      }
      playerRef.current = null;
    }
    
    // Limpar o container do player
    if (videoRef.current) {
      videoRef.current.innerHTML = '';
    }
  }, []);

  const initializePlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || !currentVideo?.id || !videoRef.current) {
      return;
    }

    // Verificar se é um tipo especial de canal
    if (currentVideo.type === 'telegram' || currentVideo.type === 'external') {
      setIsLoading(false);
      setError(null);
      return;
    }

    // Verificar se o videoId é válido para YouTube
    let videoId = currentVideo.id;
    if (videoId.includes('live_stream?channel=')) {
      // Extrair o channel ID e usar um vídeo padrão
      // const channelId = videoId.split('channel=')[1];
      // Para canais sem vídeo específico, usar um placeholder
      setError('Canal não disponível no momento. Tente outro canal.');
      setIsLoading(false);
      return;
    }

    // Aguardar um frame antes de inicializar
    requestAnimationFrame(() => {
      try {
        destroyPlayer();
        setIsLoading(true);
        setError(null);

        playerRef.current = new window.YT.Player(videoRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
            fs: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: () => {
              setIsPlayerReady(true);
              setIsLoading(false);
              setError(null);
            },
            onError: (event) => {
              console.error('YouTube Player Error:', event.data);
              setError('Erro ao carregar o vídeo. Tente outro canal.');
              setIsLoading(false);
            }
          }
        });
      } catch (err) {
        console.error('Erro ao inicializar player:', err);
        setError('Erro ao inicializar o player');
        setIsLoading(false);
      }
    });
  }, [currentVideo?.id, currentVideo?.type, destroyPlayer]);

  // Carregar YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return destroyPlayer;
  }, [initializePlayer, destroyPlayer]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    initializePlayer();
  }, [initializePlayer]);

  const scanlines = Array.from({ length: 20 }, (_, i) => (
    <div 
      key={`scanline-${i}`}
      className="h-px bg-neon-cyan/30" 
      style={{ marginTop: `${i * 20}px` }}
    />
  ));

  const loadingDots = Array.from({ length: 3 }, (_, i) => (
    <div 
      key={`dot-${i}`}
      className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" 
      style={{ animationDelay: `${i * 0.1}s` }}
    />
  ));

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-neon-cyan">
      {/* Efeito CRT */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          {scanlines}
        </div>
      </div>

      {/* Indicador LIVE */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          🔴 LIVE
        </div>
      </div>

      {/* Informações do vídeo */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/70 text-neon-cyan px-3 py-1 rounded-lg text-xs font-pixel max-w-xs">
          {currentVideo?.title || 'Carregando...'}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="text-center">
            <div className="text-neon-cyan text-4xl mb-4 animate-spin">📺</div>
            <div className="text-neon-cyan font-pixel">Carregando vídeo...</div>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1">
                {loadingDots}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <div className="text-red-500 font-pixel mb-4">{error}</div>
            <button
              type="button"
              onClick={handleRetry}
              className="bg-neon-cyan text-retro-dark px-4 py-2 rounded font-pixel hover:bg-neon-cyan/80 transition-colors"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Player Container */}
      {currentVideo?.type === 'external' || currentVideo?.type === 'telegram' ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-retro-dark to-black">
          <div className="text-center p-8">
            <div className="text-6xl mb-4 animate-bounce">
              {currentVideo?.type === 'telegram' ? '📱' : '🌐'}
            </div>
            <h3 className="text-neon-cyan font-pixel text-xl mb-4 neon-text">
              {currentVideo?.title}
            </h3>
            <p className="text-white mb-6 max-w-md">
              {currentVideo?.description}
            </p>
            <button
              onClick={() => {
                const url = currentVideo?.url || currentVideo?.id;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="bg-neon-cyan text-retro-dark px-6 py-3 rounded font-pixel hover:bg-neon-cyan/80 transition-colors"
            >
              🚀 ABRIR PLATAFORMA
            </button>
            <div className="mt-4 text-xs text-retro-border">
              Abrirá em nova aba
            </div>
          </div>
        </div>
      ) : (
        <div 
          ref={videoRef}
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;