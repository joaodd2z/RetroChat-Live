import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import useSocket from '../hooks/useSocket';

const Chat = () => {
  const {
    messages,
    nickname,
    avatar,
    isConnected,
    canSendMessage,
    setLastMessageTime,
    isMessageBanned,
    executeCommand,
    chatVisible
  } = useStore();
  
  const { sendMessage } = useSocket();
  const [inputValue, setInputValue] = useState('');
  const [cooldownTime, setCooldownTime] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const text = inputValue.trim();
    if (!text) return;

    // Verificar se é um comando
    if (text.startsWith('/')) {
      const [command, ...args] = text.split(' ');
      executeCommand(command, args);
      setInputValue('');
      return;
    }

    // Verificar cooldown
    if (!canSendMessage()) {
      setCooldownTime(5);
      return;
    }

    // Verificar palavras banidas
    if (isMessageBanned(text)) {
      alert('⚠️ Mensagem contém palavras não permitidas!');
      return;
    }

    // Se conectado, enviar via socket (não adicionar localmente)
    // Se desconectado, adicionar localmente
    if (isConnected) {
      sendMessage(text);
    } else {
      // Modo offline - adicionar mensagem localmente
      const offlineMessage = {
        type: 'user',
        text: text,
        nickname: nickname,
        avatar: avatar,
        timestamp: Date.now()
      };
      
      // Adicionar mensagem do usuário
      useStore.getState().addMessage(offlineMessage);
      
      // Adicionar aviso de modo offline
      useStore.getState().addMessage({
        type: 'system',
        text: '⚠️ Mensagem enviada em modo offline',
        nickname: 'Sistema',
        avatar: '⚠️',
        timestamp: Date.now()
      });
    }
    
    setLastMessageTime(Date.now());
    setInputValue('');
    setCooldownTime(5);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageClass = (message) => {
    const baseClass = 'p-2 rounded border-l-2 mb-2 transition-all duration-300';
    
    switch (message.type) {
      case 'system':
        return `${baseClass} bg-retro-gray/50 border-neon-yellow text-neon-yellow`;
      case 'user':
        return message.nickname === nickname 
          ? `${baseClass} bg-neon-cyan/10 border-neon-cyan text-neon-cyan`
          : `${baseClass} bg-retro-gray/30 border-retro-border text-white`;
      default:
        return `${baseClass} bg-retro-gray/30 border-retro-border text-white`;
    }
  };

  if (!chatVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => useStore.getState().toggleChat()}
          className="retro-button text-neon-cyan"
        >
          💬 Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-retro-dark border-l-2 border-retro-border">
      {/* Header do Chat */}
      <div className="flex items-center justify-between p-3 bg-retro-gray border-b border-retro-border">
        <div className="flex items-center space-x-2">
          <span className="text-neon-cyan font-pixel text-sm neon-text">
            💬 CHAT RETRÔ
          </span>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-neon-green animate-pulse' : 'bg-red-500'
          }`}></div>
        </div>
        
        <button 
          onClick={() => useStore.getState().toggleChat()}
          className="text-retro-border hover:text-neon-cyan transition-colors text-xs"
        >
          ✕
        </button>
      </div>

      {/* Status do usuário */}
      <div className="p-2 bg-retro-gray/50 border-b border-retro-border">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-2xl">{avatar}</span>
          <span className="text-neon-cyan font-pixel">{nickname}</span>
          <span className="text-retro-border">•</span>
          <span className={`text-xs ${
            isConnected ? 'text-neon-green' : 'text-red-500'
          }`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-track-retro-gray scrollbar-thumb-neon-cyan">
        {messages.length === 0 ? (
          <div className="text-center text-retro-border font-pixel text-xs py-8">
            <div className="text-2xl mb-2">👾</div>
            <div>Nenhuma mensagem ainda...</div>
            <div className="mt-2 text-neon-cyan">Digite /help para ver os comandos!</div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={getMessageClass(message)}>
              <div className="flex items-start space-x-2">
                <span className="text-lg flex-shrink-0">{message.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-pixel text-xs font-bold truncate">
                      {message.nickname}
                    </span>
                    <span className="text-xs opacity-50 flex-shrink-0">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm break-words">
                    {message.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem */}
      <div className="p-3 bg-retro-gray border-t border-retro-border">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={cooldownTime > 0 
                ? `Aguarde ${cooldownTime}s...` 
                : "Digite sua mensagem..."
              }
              disabled={cooldownTime > 0}
              className="flex-1 retro-input text-sm"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || cooldownTime > 0}
              className="retro-button px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldownTime > 0 ? cooldownTime : '📤'}
            </button>
          </div>
          
          {/* Dicas de comandos */}
          <div className="text-xs text-retro-border">
            <span>Comandos: </span>
            <span className="text-neon-cyan">/nick</span>
            <span className="mx-1">•</span>
            <span className="text-neon-cyan">/help</span>
            <span className="mx-1">•</span>
            <span className="text-neon-cyan">/reset</span>
            <span className="mx-1">•</span>
            <span className="text-neon-cyan">/mimimi</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;