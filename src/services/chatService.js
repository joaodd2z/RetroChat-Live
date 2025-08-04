import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';

class ChatService {
  constructor() {
    this.messagesCollection = 'chat_messages';
    this.maxMessages = parseInt(process.env.REACT_APP_MAX_CHAT_HISTORY) || 1000;
  }

  // Salvar mensagem no Firebase
  async saveMessage(messageData) {
    try {
      const message = {
        ...messageData,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, this.messagesCollection), message);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      throw error;
    }
  }

  // Buscar histórico de mensagens
  async getMessageHistory(channelId = 'general', limitCount = 50) {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('channelId', '==', channelId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const messages = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return messages.reverse(); // Retornar em ordem cronológica
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  // Escutar mensagens em tempo real
  subscribeToMessages(channelId = 'general', callback, limitCount = 50) {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('channelId', '==', channelId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      return onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        callback(messages.reverse());
      });
    } catch (error) {
      console.error('Erro ao escutar mensagens:', error);
      return () => {}; // Retorna função vazia para cleanup
    }
  }

  // Limpar mensagens antigas (manter apenas as últimas N mensagens)
  async cleanOldMessages(channelId = 'general') {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('channelId', '==', channelId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const messages = [];
      
      querySnapshot.forEach((doc) => {
        messages.push(doc);
      });
      
      // Se temos mais mensagens que o limite, deletar as mais antigas
      if (messages.length > this.maxMessages) {
        const messagesToDelete = messages.slice(this.maxMessages);
        
        const deletePromises = messagesToDelete.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
        
        console.log(`Limpeza concluída: ${messagesToDelete.length} mensagens antigas removidas`);
      }
    } catch (error) {
      console.error('Erro ao limpar mensagens antigas:', error);
    }
  }

  // Buscar estatísticas do chat
  async getChatStats(channelId = 'general') {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('channelId', '==', channelId)
      );
      
      const querySnapshot = await getDocs(q);
      const messages = [];
      
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      
      const stats = {
        totalMessages: messages.length,
        uniqueUsers: new Set(messages.map(m => m.user)).size,
        lastActivity: messages.length > 0 ? Math.max(...messages.map(m => new Date(m.createdAt).getTime())) : null
      };
      
      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { totalMessages: 0, uniqueUsers: 0, lastActivity: null };
    }
  }
}

export default new ChatService();