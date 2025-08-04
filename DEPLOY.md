# 🚀 Guia de Deploy - RetroChat Live

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com) (Frontend)
- Conta no [Render](https://render.com) ou [Railway](https://railway.app) (Backend)
- GitHub account
- Node.js 16+ instalado

## 🎯 Deploy do Frontend (Vercel)

### 1. Preparar o projeto
```bash
# Build local para testar
npm run build

# Testar build localmente
npx serve -s build
```

### 2. Deploy via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Deploy via GitHub
1. Push para GitHub
2. Conectar repositório no Vercel
3. Configurar variáveis de ambiente:
   - `REACT_APP_SOCKET_URL`: URL do seu backend

### 4. Configurações do Vercel

Crie `vercel.json` na raiz:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🖥️ Deploy do Backend (Render)

### 1. Preparar o servidor
```bash
cd server

# Testar localmente
npm start
```

### 2. Configurar package.json do servidor
Adicione no `server/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 3. Deploy no Render
1. Conecte seu repositório GitHub
2. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
   - **Root Directory**: `/`

### 4. Variáveis de Ambiente (Render)
```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://seu-frontend.vercel.app
```

## 🛠️ Deploy Alternativo (Railway)

### 1. Configurar Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway deploy
```

### 2. Configurar variáveis
```env
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.vercel.app
```

## 🔧 Configurações de Produção

### Frontend (.env.production)
```env
REACT_APP_SOCKET_URL=https://seu-backend.render.com
GENERATE_SOURCEMAP=false
```

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://seu-frontend.vercel.app,https://retrochat-live.vercel.app
```

## 📊 Monitoramento

### Health Check Endpoints
- `GET /health` - Status do servidor
- `GET /stats` - Estatísticas em tempo real

### Logs
```bash
# Render
railway logs

# Railway
railway logs
```

## 🔒 Segurança

### Headers de Segurança
O servidor já inclui:
- Helmet.js para headers de segurança
- CORS configurado
- Rate limiting
- Sanitização de input

### SSL/HTTPS
- Vercel: SSL automático
- Render: SSL automático
- Railway: SSL automático

## 🚨 Troubleshooting

### Erro de CORS
```javascript
// server/server.js
const io = socketIo(server, {
  cors: {
    origin: [
      "https://seu-frontend.vercel.app",
      "http://localhost:3000" // Para desenvolvimento
    ],
    methods: ["GET", "POST"]
  }
});
```

### Socket não conecta
1. Verificar URL no frontend
2. Verificar CORS no backend
3. Verificar se o servidor está rodando

### Build falha
```bash
# Limpar cache
npm run build -- --reset-cache

# Ou
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📈 Otimizações

### Frontend
- Code splitting automático (React)
- Lazy loading de componentes
- Service Worker (PWA)
- Compressão Gzip (Vercel)

### Backend
- Rate limiting configurado
- Conexões WebSocket otimizadas
- Limpeza automática de memória

## 🔄 CI/CD

### GitHub Actions (opcional)
Crie `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    - run: npm install
    - run: npm run build
    - uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📱 PWA (Progressive Web App)

O projeto já está configurado como PWA:
- `manifest.json` configurado
- Service Worker (via Create React App)
- Ícones responsivos
- Instalável no mobile

## 🌐 Domínio Customizado

### Vercel
1. Adicionar domínio no dashboard
2. Configurar DNS:
   ```
   CNAME retrochat.live -> cname.vercel-dns.com
   ```

### Render
1. Adicionar domínio customizado
2. Configurar DNS:
   ```
   CNAME api.retrochat.live -> seu-app.onrender.com
   ```

## 📊 Analytics (Opcional)

### Google Analytics
```javascript
// src/index.js
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send('pageview');
```

### Vercel Analytics
```javascript
// src/App.js
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## ✅ Checklist de Deploy

- [ ] Testar build local
- [ ] Configurar variáveis de ambiente
- [ ] Deploy do backend
- [ ] Deploy do frontend
- [ ] Testar conexão Socket.IO
- [ ] Testar chat em tempo real
- [ ] Verificar responsividade
- [ ] Testar PWA
- [ ] Configurar domínio (opcional)
- [ ] Configurar analytics (opcional)

**🎉 Parabéns! Seu RetroChat Live está no ar!**