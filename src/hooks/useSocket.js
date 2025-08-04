import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

// Para desenvolvimento local, use localhost:3001
// Para produção, substitua pela URL do seu servidor
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-socket-server.render.com' 
  : 'http://localhost:3001';

const useSocket = () => {
  const socketRef = useRef(null);
  const { 
    nickname, 
    avatar, 
    addMessage, 
    setConnected,
    isConnected 
  } = useStore();

  useEffect(() => {
    // Só conecta se tiver nickname
    if (!nickname) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Conectar ao socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    const socket = socketRef.current;

    // Event listeners
    socket.on('connect', () => {
      console.log('🔌 Conectado ao servidor de chat!');
      setConnected(true);
      
      // Enviar dados do usuário
      socket.emit('user_join', {
        nickname,
        avatar
      });
      
      // Mensagem de boas-vindas
      addMessage({
        type: 'system',
        text: `🎉 ${nickname} entrou no chat!`,
        nickname: 'Sistema',
        avatar: '🤖'
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
      setConnected(false);
      
      addMessage({
        type: 'system',
        text: '⚠️ Conexão perdida. Tentando reconectar...',
        nickname: 'Sistema',
        avatar: '⚠️'
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
      setConnected(false);
      
      addMessage({
        type: 'system',
        text: '❌ Erro de conexão. Modo offline ativado.',
        nickname: 'Sistema',
        avatar: '❌'
      });
    });

    // Receber mensagens
    socket.on('new_message', (messageData) => {
      // Só adicionar se não for a própria mensagem do usuário
      // (evita duplicação quando o servidor retorna nossa própria mensagem)
      if (messageData.nickname !== nickname) {
        addMessage({
          type: 'user',
          text: messageData.text,
          nickname: messageData.nickname,
          avatar: messageData.avatar,
          userId: messageData.userId
        });
      }
    });

    // Usuário entrou
    socket.on('user_joined', (userData) => {
      if (userData.nickname !== nickname) {
        addMessage({
          type: 'system',
          text: `👋 ${userData.nickname} entrou no chat`,
          nickname: 'Sistema',
          avatar: '👋'
        });
      }
    });

    // Usuário saiu
    socket.on('user_left', (userData) => {
      addMessage({
        type: 'system',
        text: `👋 ${userData.nickname} saiu do chat`,
        nickname: 'Sistema',
        avatar: '👋'
      });
    });

    // Contagem de usuários online
    socket.on('users_count', (count) => {
      // Você pode usar isso para mostrar quantos usuários estão online
      console.log(`👥 Usuários online: ${count}`);
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [nickname, avatar, addMessage, setConnected]);

  // Função para enviar mensagem
  const sendMessage = (text) => {
    if (!socketRef.current || !isConnected) {
      // Se offline, apenas adicionar localmente
      addMessage({
        type: 'system',
        text: '⚠️ Mensagem não enviada - você está offline',
        nickname: 'Sistema',
        avatar: '⚠️',
        timestamp: Date.now()
      });
      return;
    }

    // Adicionar mensagem localmente primeiro (já que filtramos no new_message)
    addMessage({
      type: 'user',
      text: text,
      nickname: nickname,
      avatar: avatar,
      timestamp: Date.now()
    });

    // Enviar via socket para outros usuários
    socketRef.current.emit('send_message', {
      text,
      nickname,
      avatar
    });
  };

  // Função para atualizar dados do usuário
  const updateUser = (newNickname, newAvatar) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('update_user', {
        nickname: newNickname,
        avatar: newAvatar
      });
    }
  };

  return {
    sendMessage,
    updateUser,
    isConnected,
    socket: socketRef.current
  };
};

export default useSocket;