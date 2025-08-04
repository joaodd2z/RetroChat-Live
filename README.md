# 🎮 RetroLive Chat

> Uma experiência de chat imersiva com visual cyberpunk e funcionalidades avançadas
NÃO ESTÁ COMPLETO... MUITAS COISAS EM ANDAMENTO AINDA! 
## ✨ Sobre o Projeto

O RetroLive é uma plataforma de chat em tempo real que combina nostalgia dos anos 80/90 com tecnologia moderna. Desenvolvido para criar uma experiência única de comunicação com visual cyberpunk, efeitos especiais e integração completa com conteúdo multimídia.

## 🚀 Funcionalidades Principais

### 💬 Sistema de Chat Avançado
- **Chat em tempo real** com Socket.IO
- **Mensagens persistentes** com histórico completo
- **Sistema de notificações** visuais e sonoras
- **Emojis e reações** personalizadas
- **Comandos especiais** para moderação

### 📺 Player Multimídia Integrado
- **Player de YouTube** com sincronização em grupo
- **Controles compartilhados** entre usuários
- **Playlist colaborativa** com votação
- **Modo cinema** para experiência imersiva

### 🎯 Canais Especializados
- **Categorização inteligente** por temas
- **Canais Universo Z** com efeitos exclusivos
- **Sistema de busca** avançado
- **Filtros personalizáveis** por categoria

### 🎨 Interface e Experiências Visuais
- **Tema cyberpunk** com neon e gradientes
- **Animações fluidas** e transições suaves
- **Sistema de partículas** interativo
- **Mascote animado** com personalidade
- **Efeitos especiais** para canais premium

### 🔧 Ferramentas Integradas
- **Busca no YouTube** diretamente na interface
- **Gerenciador de favoritos** personalizado
- **Sistema de tags** para organização
- **Modo escuro/claro** adaptativo

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **Tailwind CSS** - Estilização moderna
- **Zustand** - Gerenciamento de estado
- **Socket.IO Client** - Comunicação em tempo real
- **Framer Motion** - Animações avançadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - WebSockets em tempo real
- **Firebase** - Banco de dados e autenticação

### Ferramentas de Desenvolvimento
- **Create React App** - Configuração inicial
- **PostCSS** - Processamento de CSS
- **ESLint** - Qualidade de código

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn
- Conta no Firebase (opcional)

### 1. Clone o Repositório
```bash
git clone https://github.com/SEU_USUARIO/RetroLive.git
cd RetroLive
```

### 2. Instale as Dependências
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Configure as Variáveis de Ambiente
```bash
# Crie um arquivo .env na raiz do projeto
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_dominio
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
```

### 4. Execute o Projeto
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm start
```

## 🎯 Como Usar

1. **Acesse** `http://localhost:3000`
2. **Escolha um nickname** na modal inicial
3. **Selecione um canal** da lista disponível
4. **Comece a conversar** e explore as funcionalidades
5. **Use as ferramentas** integradas para buscar conteúdo

## 🎨 Personalização

### Adicionando Novos Canais
Edite o arquivo `src/data/channels.js`:

```javascript
{
  id: 'novo-canal',
  name: '🎮 Meu Canal',
  description: 'Descrição do canal',
  category: 'games',
  type: 'live',
  videoId: 'ID_DO_VIDEO',
  viewers: 0,
  isLive: true
}
```

### Modificando Temas
Personalize as cores em `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'cyber-blue': '#00f5ff',
      'neon-pink': '#ff0080'
    }
  }
}
```

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Build para produção

```bash
npm run build
```

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
