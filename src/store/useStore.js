import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Lista de avatares retrô disponíveis
const RETRO_AVATARS = [
  '🤖', '👾', '🕹️', '💾', '📺', '🔌', '⚡', '🌐', '💿', '📼'
];

// Lista de palavras banidas
const BANNED_WORDS = [
  'spam', 'idiota', 'burro', 'lixo'
  // Adicione mais palavras conforme necessário
];

const useStore = create(
  persist(
    (set, get) => ({
      // User state
      nickname: '',
      avatar: RETRO_AVATARS[0],
      isConnected: false,
      
      // Chat state
      messages: [],
      lastMessageTime: 0,
      
      // Video state
      currentVideo: {
        id: 'jfKfPfyJRdk', // Lofi Girl como padrão
        title: '🎵 Lofi Hip Hop Radio - Música relaxante 24/7',
        type: 'youtube',
        description: 'Música relaxante para estudar e trabalhar'
      },
      
      // UI state
      showNicknameModal: true,
      chatVisible: true,
      
      // Actions
      setNickname: (nickname) => {
        const sanitized = nickname.trim().slice(0, 20);
        if (sanitized) {
          set({ nickname: sanitized, showNicknameModal: false });
        }
      },
      
      setAvatar: (avatar) => set({ avatar }),
      
      setConnected: (connected) => set({ isConnected: connected }),
      
      addMessage: (message) => {
        const messages = get().messages;
        const newMessage = {
          id: Date.now() + Math.random(),
          ...message,
          timestamp: Date.now()
        };
        
        // Manter apenas as últimas 100 mensagens
        const updatedMessages = [...messages, newMessage].slice(-100);
        set({ messages: updatedMessages });
      },
      
      clearMessages: () => set({ messages: [] }),
      
      removeMessage: (messageId) => {
        const messages = get().messages.filter(msg => msg.id !== messageId);
        set({ messages });
      },
      
      canSendMessage: () => {
        const now = Date.now();
        const lastTime = get().lastMessageTime;
        return now - lastTime >= 5000; // 5 segundos de cooldown
      },
      
      setLastMessageTime: (time) => set({ lastMessageTime: time }),
      
      isMessageBanned: (text) => {
        const lowerText = text.toLowerCase();
        return BANNED_WORDS.some(word => lowerText.includes(word));
      },
      
      setCurrentVideo: (video) => set({ currentVideo: video }),
      
      toggleChat: () => set((state) => ({ chatVisible: !state.chatVisible })),
      
      resetNickname: () => set({ 
        nickname: '', 
        showNicknameModal: true,
        avatar: RETRO_AVATARS[0]
      }),
      
      // Comandos do chat
      executeCommand: (command, args) => {
        const { addMessage, setNickname, resetNickname, clearMessages } = get();
        
        switch (command) {
          case '/nick':
            if (args.length > 0) {
              setNickname(args.join(' '));
              addMessage({
                type: 'system',
                text: `Nickname alterado para: ${args.join(' ')}`,
                nickname: 'Sistema',
                avatar: '🤖'
              });
            }
            break;
            
          case '/reset':
            resetNickname();
            addMessage({
              type: 'system',
              text: 'Dados resetados. Escolha um novo nickname.',
              nickname: 'Sistema',
              avatar: '🤖'
            });
            break;
            
          case '/clear':
            clearMessages();
            break;
            
          case '/help':
            addMessage({
              type: 'system',
              text: 'Comandos: /nick [nome], /reset, /clear, /help, /report [id]',
              nickname: 'Sistema',
              avatar: '🤖'
            });
            break;
            
          case '/mimimi':
            addMessage({
              type: 'system',
              text: '🎭 Modo nostalgia ativado! Bem-vindo aos anos 2000! 🎭',
              nickname: 'Tio do Chat',
              avatar: '👴'
            });
            break;
            
          case '/report':
            if (args.length > 0) {
              const messageId = parseInt(args[0]);
              if (messageId) {
                addMessage({
                  type: 'system',
                  text: `Mensagem ${messageId} reportada e ocultada.`,
                  nickname: 'Moderador',
                  avatar: '🛡️'
                });
              }
            }
            break;
            
          default:
            addMessage({
              type: 'system',
              text: `Comando "${command}" não reconhecido. Digite /help para ver os comandos.`,
              nickname: 'Sistema',
              avatar: '❌'
            });
        }
      },
      
      // Getters
      getRetroAvatars: () => RETRO_AVATARS,
    }),
    {
      name: 'retrochat-storage',
      partialize: (state) => ({
        nickname: state.nickname,
        avatar: state.avatar,
        showNicknameModal: state.showNicknameModal
      })
    }
  )
);

export default useStore;