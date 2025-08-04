const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
const server = http.createServer(app);

// Configuração do CORS para Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://your-frontend-domain.vercel.app"] 
      : ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://your-frontend-domain.vercel.app"] 
    : ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (socket) => socket.handshake.address,
  points: 10, // 10 mensagens
  duration: 60, // por minuto
});

// Armazenamento em memória (em produção, use Redis)
const connectedUsers = new Map();
const chatHistory = [];
const MAX_HISTORY = 100;

// Lista de palavras banidas
const BANNED_WORDS = [
  'spam', 'idiota', 'burro', 'lixo', 'merda', 'porra'
  // Adicione mais palavras conforme necessário
];

// Função para verificar palavras banidas
function containsBannedWords(text) {
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word));
}

// Função para sanitizar texto
function sanitizeText(text) {
  return text
    .trim()
    .slice(0, 200) // Máximo 200 caracteres
    .replace(/[<>"'&]/g, ''); // Remove caracteres perigosos
}

// Função para gerar ID único
function generateUserId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    chatHistory: chatHistory.length
  });
});

// Rota para estatísticas
app.get('/stats', (req, res) => {
  res.json({
    connectedUsers: connectedUsers.size,
    totalMessages: chatHistory.length,
    uptime: process.uptime()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Novo usuário conectado: ${socket.id}`);
  
  // Gerar ID único para o usuário
  const userId = generateUserId();
  
  // Armazenar dados do usuário
  connectedUsers.set(socket.id, {
    id: userId,
    socketId: socket.id,
    nickname: '',
    avatar: '🤖',
    joinedAt: Date.now(),
    lastMessage: 0
  });

  // Enviar histórico de mensagens para o novo usuário
  socket.emit('chat_history', chatHistory.slice(-50)); // Últimas 50 mensagens
  
  // Enviar contagem de usuários
  io.emit('users_count', connectedUsers.size);

  // Usuário se junta ao chat
  socket.on('user_join', (userData) => {
    try {
      const user = connectedUsers.get(socket.id);
      if (user && userData.nickname) {
        user.nickname = sanitizeText(userData.nickname);
        user.avatar = userData.avatar || '🤖';
        
        console.log(`👋 ${user.nickname} entrou no chat`);
        
        // Notificar outros usuários
        socket.broadcast.emit('user_joined', {
          nickname: user.nickname,
          avatar: user.avatar,
          userId: user.id
        });
        
        // Adicionar mensagem ao histórico
        const joinMessage = {
          id: Date.now(),
          type: 'system',
          text: `${user.nickname} entrou no chat`,
          nickname: 'Sistema',
          avatar: '👋',
          timestamp: Date.now()
        };
        
        chatHistory.push(joinMessage);
        if (chatHistory.length > MAX_HISTORY) {
          chatHistory.shift();
        }
        
        io.emit('new_message', joinMessage);
      }
    } catch (error) {
      console.error('Erro ao processar user_join:', error);
    }
  });

  // Receber mensagem
  socket.on('send_message', async (messageData) => {
    try {
      // Rate limiting
      try {
        await rateLimiter.consume(socket.handshake.address);
      } catch (rateLimiterRes) {
        socket.emit('rate_limit_exceeded', {
          message: 'Muitas mensagens! Aguarde um momento.',
          retryAfter: rateLimiterRes.msBeforeNext
        });
        return;
      }

      const user = connectedUsers.get(socket.id);
      if (!user || !user.nickname) {
        socket.emit('error', { message: 'Usuário não autenticado' });
        return;
      }

      const text = sanitizeText(messageData.text);
      if (!text) {
        return;
      }

      // Verificar palavras banidas
      if (containsBannedWords(text)) {
        socket.emit('message_blocked', {
          message: 'Mensagem contém palavras não permitidas'
        });
        return;
      }

      // Verificar cooldown (5 segundos)
      const now = Date.now();
      if (now - user.lastMessage < 5000) {
        socket.emit('cooldown_active', {
          message: 'Aguarde antes de enviar outra mensagem',
          remainingTime: 5000 - (now - user.lastMessage)
        });
        return;
      }

      user.lastMessage = now;

      // Criar mensagem
      const message = {
        id: Date.now(),
        type: 'user',
        text: text,
        nickname: user.nickname,
        avatar: user.avatar,
        userId: user.id,
        timestamp: now
      };

      // Adicionar ao histórico
      chatHistory.push(message);
      if (chatHistory.length > MAX_HISTORY) {
        chatHistory.shift();
      }

      // Enviar para todos os usuários (incluindo o remetente)
      io.emit('new_message', message);
      
      console.log(`💬 ${user.nickname}: ${text}`);
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      socket.emit('error', { message: 'Erro interno do servidor' });
    }
  });

  // Atualizar dados do usuário
  socket.on('update_user', (userData) => {
    try {
      const user = connectedUsers.get(socket.id);
      if (user) {
        const oldNickname = user.nickname;
        user.nickname = sanitizeText(userData.nickname);
        user.avatar = userData.avatar || user.avatar;
        
        if (oldNickname !== user.nickname) {
          const updateMessage = {
            id: Date.now(),
            type: 'system',
            text: `${oldNickname} mudou o nome para ${user.nickname}`,
            nickname: 'Sistema',
            avatar: '🔄',
            timestamp: Date.now()
          };
          
          chatHistory.push(updateMessage);
          if (chatHistory.length > MAX_HISTORY) {
            chatHistory.shift();
          }
          
          io.emit('new_message', updateMessage);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  });

  // Desconexão
  socket.on('disconnect', (reason) => {
    try {
      const user = connectedUsers.get(socket.id);
      if (user && user.nickname) {
        console.log(`👋 ${user.nickname} saiu do chat (${reason})`);
        
        // Notificar outros usuários
        socket.broadcast.emit('user_left', {
          nickname: user.nickname,
          avatar: user.avatar,
          userId: user.id
        });
        
        // Adicionar mensagem ao histórico
        const leaveMessage = {
          id: Date.now(),
          type: 'system',
          text: `${user.nickname} saiu do chat`,
          nickname: 'Sistema',
          avatar: '👋',
          timestamp: Date.now()
        };
        
        chatHistory.push(leaveMessage);
        if (chatHistory.length > MAX_HISTORY) {
          chatHistory.shift();
        }
        
        socket.broadcast.emit('new_message', leaveMessage);
      }
      
      connectedUsers.delete(socket.id);
      
      // Atualizar contagem de usuários
      io.emit('users_count', connectedUsers.size);
      
    } catch (error) {
      console.error('Erro ao processar desconexão:', error);
    }
  });

  // Tratamento de erros
  socket.on('error', (error) => {
    console.error(`❌ Erro no socket ${socket.id}:`, error);
  });
});

// Limpeza periódica do histórico (a cada hora)
setInterval(() => {
  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
    console.log('🧹 Histórico de chat limpo');
  }
}, 3600000); // 1 hora

// Configuração da porta
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.IO rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📺 RetroChat Live Server iniciado!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso');
    process.exit(0);
  });
});