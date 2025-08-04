# RetroChat-Live Deploy Final Script
# PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    🚀 RETROCHAT-LIVE DEPLOY FINAL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar arquivos essenciais
Write-Host "✅ Verificando arquivos essenciais..." -ForegroundColor Green

$essentialFiles = @(
    "vercel.json",
    ".env.example",
    "src\config\firebase.js",
    "src\services\chatService.js",
    "src\components\AdminPanel.js",
    "src\components\WordPressAutomation.js",
    "src\services\streamService.js"
)

$missingFiles = @()
foreach ($file in $essentialFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ ERRO: Arquivos essenciais não encontrados:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "✅ Todos os arquivos essenciais estão presentes!" -ForegroundColor Green
Write-Host ""

# Verificar se estamos em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ ERRO: Não é um repositório Git!" -ForegroundColor Red
    Write-Host "Execute 'git init' primeiro." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Adicionar arquivos ao Git
Write-Host "📦 Adicionando arquivos ao Git..." -ForegroundColor Blue
try {
    git add .
    Write-Host "✅ Arquivos adicionados com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao adicionar arquivos: $_" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Criar commit
Write-Host "📝 Criando commit..." -ForegroundColor Blue
try {
    git commit -m "🚀 Deploy completo: Firebase + WordPress + Vercel + Streams automáticos"
    Write-Host "✅ Commit criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao criar commit: $_" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Push para GitHub
Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Blue
try {
    git push origin master
    $pushSuccess = $LASTEXITCODE -eq 0
} catch {
    $pushSuccess = $false
    Write-Host "❌ Erro no push: $_" -ForegroundColor Red
}

if ($pushSuccess) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "    ✅ DEPLOY ENVIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🎯 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Acesse: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Clique em 'New Project'" -ForegroundColor White
    Write-Host "3. Selecione 'RetroChat-Live'" -ForegroundColor White
    Write-Host "4. Configure as variáveis de ambiente:" -ForegroundColor White
    Write-Host "   - REACT_APP_ADMIN_USERNAME=joaodd2" -ForegroundColor Cyan
    Write-Host "   - REACT_APP_ADMIN_PASSWORD=Killer007@" -ForegroundColor Cyan
    Write-Host "5. Clique em 'Deploy'" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔥 FUNCIONALIDADES INCLUÍDAS:" -ForegroundColor Yellow
    Write-Host "✅ Chat com histórico Firebase" -ForegroundColor Green
    Write-Host "✅ Streams automáticos de futebol" -ForegroundColor Green
    Write-Host "✅ Painel admin (Ctrl+Shift+A)" -ForegroundColor Green
    Write-Host "✅ Integração WordPress" -ForegroundColor Green
    Write-Host "✅ Automação inteligente" -ForegroundColor Green
    Write-Host "✅ Interface responsiva" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🎮 Login Admin: joaodd2 / Killer007@" -ForegroundColor Magenta
    Write-Host ""
    
    Write-Host "🌐 Repositório GitHub:" -ForegroundColor Yellow
    Write-Host "https://github.com/joaodd2z/RetroChat-Live" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "    🌟 RETROCHAT-LIVE ESTÁ PRONTO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
} else {
    Write-Host ""
    Write-Host "❌ ERRO no push para GitHub!" -ForegroundColor Red
    Write-Host "Verifique sua conexão e tente novamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "1. Verifique se você está logado no Git" -ForegroundColor White
    Write-Host "2. Verifique sua conexão com a internet" -ForegroundColor White
    Write-Host "3. Verifique se o repositório existe no GitHub" -ForegroundColor White
}

Write-Host ""
Read-Host "Pressione Enter para continuar"