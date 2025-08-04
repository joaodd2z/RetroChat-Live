# 🎮 RetroChat Live

Um sistema de entretenimento ao vivo com chat integrado, oferecendo uma experiência nostálgica dos anos 80/90 com tecnologia moderna.

## ✨ Características

- 📺 **Canais de TV ao vivo** - CNN Brasil, SBT News, GloboNews, BandNews, Record News
- 🎵 **Música 24/7** - Lofi Hip Hop, Synthwave, Jazz, Anime Music
- 🎮 **Gaming** - Retro Games, Minecraft Music
- 🔬 **Ciência** - NASA Earth Live, conteúdo educativo
- 🧘 **Relaxamento** - Sons da natureza, música ambiente
- 💬 **Chat em tempo real** - Interação entre usuários
- 🎨 **Design retrô** - Interface nostálgica com efeitos neon
- ✨ **Sistema de partículas** - Animações visuais imersivas

## 🚀 Tecnologias

- **React 18** - Framework principal
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Socket.io** - Chat em tempo real
- **YouTube API** - Integração de vídeos

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/retrochat-live.git

# Entre no diretório
cd retrochat-live

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
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