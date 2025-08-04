// Configuração do Firebase para WP-Admin
// Credenciais: login: joaodd2, senha: Killer007@

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Verificar se as credenciais do Firebase são válidas
const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_API_KEY && 
  !process.env.REACT_APP_FIREBASE_API_KEY.includes('Demo') &&
  !process.env.REACT_APP_FIREBASE_API_KEY.includes('demo');

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:demo',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || 'https://demo.firebaseio.com/'
};

// Verificar se é configuração de demo
const isDemoConfig = !isFirebaseConfigured;

let app, auth, db, storage;

if (isDemoConfig) {
  // Modo demo - sem Firebase real
  console.log('🔥 Modo Demo: Firebase desabilitado');
  auth = null;
  db = null;
  storage = null;
} else {
  // Inicializar Firebase real
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase não configurado corretamente, usando modo demo:', error.message);
    auth = null;
    db = null;
    storage = null;
  }
}

export { auth, db, storage };

// Conectar ao emulador em desenvolvimento
if (process.env.NODE_ENV === 'development' && db && !isDemoConfig) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firestore emulator already connected');
  }
}

// Função para login do admin
export const loginAdmin = async (email = 'jL.lucas.oliveira@hotmail.com', password = 'Killer007@') => {
  if (isDemoConfig || !auth) {
    console.log('Modo demo: Login simulado com sucesso');
    return { uid: 'demo-user', email: email };
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Admin logado com sucesso:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Erro no login do admin:', error);
    throw error;
  }
};

// Função para salvar configurações do sistema
export const saveSystemConfig = async (config) => {
  if (isDemoConfig || !db) {
    console.log('Modo demo: Configurações salvas localmente');
    localStorage.setItem('retrolive_config', JSON.stringify(config));
    return;
  }
  
  try {
    const configRef = doc(db, 'system', 'config');
    await setDoc(configRef, {
      ...config,
      updatedAt: new Date(),
      updatedBy: auth.currentUser?.uid || 'system'
    }, { merge: true });
    console.log('Configurações salvas com sucesso');
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    throw error;
  }
};

// Função para carregar configurações do sistema
export const loadSystemConfig = async () => {
  if (isDemoConfig || !db) {
    console.log('Modo demo: Carregando configurações locais');
    const localConfig = localStorage.getItem('retrolive_config');
    return localConfig ? JSON.parse(localConfig) : getDefaultConfig();
  }
  
  try {
    const configRef = doc(db, 'system', 'config');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data();
    } else {
      console.log('Nenhuma configuração encontrada, usando padrões');
      return getDefaultConfig();
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    return getDefaultConfig();
  }
};

// Configurações padrão do sistema
const getDefaultConfig = () => ({
  siteName: 'RetroLive',
  theme: 'cyberpunk',
  enableChat: true,
  enableMascot: true,
  maxUsers: 100,
  channels: {
    enableYoutube: true,
    enableTelegram: true,
    enableExternal: true
  },
  security: {
    enableModeration: true,
    wordFilter: true,
    rateLimiting: true
  },
  performance: {
    enableOptimizations: true,
    lowEndMode: false,
    maxConcurrentStreams: 5
  },
  createdAt: new Date(),
  version: '1.0.0'
});

// Função para atualizar canais
export const updateChannels = async (channels) => {
  if (isDemoConfig || !db) {
    console.log('Modo demo: Canais salvos localmente');
    localStorage.setItem('retrolive_channels', JSON.stringify(channels));
    return;
  }
  
  try {
    const channelsRef = doc(db, 'system', 'channels');
    await setDoc(channelsRef, {
      channels,
      updatedAt: new Date(),
      updatedBy: auth.currentUser?.uid || 'system'
    });
    console.log('Canais atualizados com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar canais:', error);
    throw error;
  }
};

// Função para carregar canais
export const loadChannels = async () => {
  if (isDemoConfig || !db) {
    console.log('Modo demo: Carregando canais locais');
    const localChannels = localStorage.getItem('retrolive_channels');
    return localChannels ? JSON.parse(localChannels) : null;
  }
  
  try {
    const channelsRef = doc(db, 'system', 'channels');
    const channelsSnap = await getDoc(channelsRef);
    
    if (channelsSnap.exists()) {
      return channelsSnap.data().channels;
    } else {
      return null; // Usar canais padrão do arquivo local
    }
  } catch (error) {
    console.error('Erro ao carregar canais:', error);
    return null;
  }
};

// Função para salvar logs de atividade
export const saveActivityLog = async (action, details) => {
  if (isDemoConfig || !db) {
    console.log('Modo demo: Log salvo localmente:', { action, details });
    return;
  }
  
  try {
    const logRef = doc(db, 'logs', Date.now().toString());
    await setDoc(logRef, {
      action,
      details,
      timestamp: new Date(),
      userId: auth.currentUser?.uid || 'anonymous',
      userAgent: navigator.userAgent,
      ip: 'client-side' // Em produção, capturar do servidor
    });
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
};

export default app;