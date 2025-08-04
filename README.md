# RetroChat-Live 🎮📺

Um sistema de chat ao vivo com streams integrados, automação WordPress e histórico Firebase.

## 🚀 Deploy no Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Projeto no GitHub
3. Conta Firebase (opcional para histórico)
4. WordPress com API REST habilitada (opcional)

### Passos para Deploy

1. **Conectar ao GitHub**
   - Acesse [Vercel Dashboard](https://vercel.com/dashboard)
   - Clique em "New Project"
   - Conecte sua conta GitHub
   - Selecione o repositório `RetroChat-Live`

2. **Configurar Variáveis de Ambiente**
   No painel do Vercel, vá em Settings > Environment Variables e adicione:

   ```
   # Firebase (opcional)
   REACT_APP_FIREBASE_API_KEY=sua_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
   
   # Admin Credentials
   REACT_APP_ADMIN_USERNAME=joaodd2
   REACT_APP_ADMIN_PASSWORD=Killer007@
   
   # WordPress (opcional)
   REACT_APP_WP_URL=https://seusite.com
   REACT_APP_WP_USERNAME=joaodd2
   REACT_APP_WP_PASSWORD=Killer007@
   
   # Configurações
   REACT_APP_ENABLE_CHAT_HISTORY=true
   REACT_APP_ENABLE_STREAM_AUTOMATION=true
   REACT_APP_STREAM_UPDATE_INTERVAL=300000
   ```

3. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu site estará disponível em `https://seu-projeto.vercel.app`

## 🔧 Configuração Local

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configurar ambiente**
   - Copie `.env.example` para `.env`
   - Preencha as variáveis necessárias

3. **Executar localmente**
   ```bash
   npm start
   ```

## 📱 Funcionalidades

### Chat em Tempo Real
- ✅ Mensagens instantâneas
- ✅ Histórico no Firebase
- ✅ Emojis e formatação
- ✅ Sistema de moderação

### Streams Automáticos
- ✅ Futebol ao vivo
- ✅ Música e entretenimento
- ✅ Rotação automática
- ✅ URLs de backup

### Painel Administrativo
- ✅ Login: `joaodd2` / `Killer007@`
- ✅ Estatísticas em tempo real
- ✅ Controle de streams
- ✅ Integração WordPress

### Atalhos do Teclado
- `Ctrl + Shift + A`: Painel Admin
- `Ctrl + L`: Seletor de Streams
- `Ctrl + C`: Seletor de Canais

## 🔗 Integração WordPress

### Configuração
1. Instale o plugin "Application Passwords" no WordPress
2. Crie uma senha de aplicação para o usuário `joaodd2`
3. Configure as variáveis `REACT_APP_WP_*` no Vercel

### Automação
- Posts automáticos para streams
- Categorização por tipo (Futebol, Música, etc.)
- Agendamento de publicações
- Sincronização bidirecional

## 🔥 Firebase Setup

1. **Criar Projeto**
   - Acesse [Firebase Console](https://console.firebase.google.com)
   - Crie um novo projeto
   - Habilite Firestore Database

2. **Configurar Firestore**
   - Modo de produção
   - Regras básicas de segurança
   - Coleção `messages` será criada automaticamente

3. **Obter Credenciais**
   - Project Settings > General
   - Copie as configurações do SDK
   - Adicione no Vercel como variáveis de ambiente

## 📊 Monitoramento

### Logs Disponíveis
- Chat: mensagens, usuários ativos
- Streams: status, falhas, atualizações
- WordPress: sincronizações, erros
- Sistema: performance, uptime

### Métricas
- Usuários simultâneos
- Mensagens por minuto
- Streams ativos/inativos
- Taxa de sucesso WordPress

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/          # Componentes React
├── services/           # Serviços (Firebase, WordPress)
├── config/             # Configurações
├── data/              # Dados estáticos
├── store/             # Estado global
└── styles/            # Estilos CSS
```

### Scripts Disponíveis
- `npm start`: Desenvolvimento
- `npm run build`: Build de produção
- `npm run vercel-build`: Build para Vercel
- `npm test`: Testes

## 🚨 Troubleshooting

### Problemas Comuns

1. **Chat não carrega histórico**
   - Verifique credenciais Firebase
   - Confirme regras do Firestore

2. **Streams não atualizam**
   - Verifique `REACT_APP_ENABLE_STREAM_AUTOMATION`
   - Confirme URLs dos streams

3. **WordPress não sincroniza**
   - Teste credenciais manualmente
   - Verifique API REST habilitada

4. **Build falha no Vercel**
   - Confirme todas as variáveis de ambiente
   - Verifique logs de build

### Suporte
Para problemas técnicos, verifique:
1. Console do navegador (F12)
2. Logs do Vercel
3. Logs do Firebase
4. Status da API WordPress

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── VideoPlayer.js   # Player de vídeo principal
│   ├── Chat.js          # Sistema de chat
│   ├── ChannelSelector.js # Seletor de canais
│   ├── Mascot.js        # Mascote animado
│   └── ParticleSystem.js # Sistema de partículas
├── data/
│   └── channels.js      # Dados dos canais
├── store/
│   └── useStore.js      # Estado global
└── styles/
    └── globals.css      # Estilos globais
```

## 🎯 Funcionalidades

### Canais Disponíveis

- **Notícias**: CNN Brasil, SBT News, GloboNews, BandNews, Record News, Jovem Pan News
- **Cultura**: TV Cultura, TV Brasil
- **Música**: Lofi Hip Hop, Synthwave, Jazz Café, Anime Music
- **Games**: Retro Games 24/7, Minecraft Music
- **Ciência**: NASA Earth Live
- **Relaxamento**: Natureza, Sons Ambiente

### Chat Features

- Mensagens em tempo real
- Avatars personalizados
- Notificações do sistema
- Histórico de mensagens

## 🔧 Configuração

O projeto está configurado para funcionar imediatamente após a instalação. Todos os canais utilizam transmissões legais do YouTube.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do chat do sistema.

---

**Desenvolvido com ❤️ para a comunidade RetroChat Live**