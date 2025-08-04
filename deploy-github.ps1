# RetroLive - Script de Deploy para GitHub
# Execução: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Depois: .\deploy-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    RetroLive - Deploy para GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar status do repositório
Write-Host "[1/4] Verificando status do repositório..." -ForegroundColor Yellow
git status
Write-Host ""

# Configurar remote
Write-Host "[2/4] Configurando remote origin..." -ForegroundColor Yellow
$githubUser = Read-Host "Digite seu nome de usuário do GitHub"

try {
    git remote add origin "https://github.com/$githubUser/RetroChat-Live.git"
    Write-Host "Remote configurado para: https://github.com/$githubUser/RetroChat-Live.git" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar remote. Verifique se já não existe um remote 'origin'." -ForegroundColor Red
    Write-Host "Para remover: git remote remove origin" -ForegroundColor Yellow
}
Write-Host ""

# Fazer push
Write-Host "[3/4] Fazendo push para o GitHub..." -ForegroundColor Yellow
Write-Host "IMPORTANTE: Certifique-se de que o repositório 'RetroChat-Live' existe no seu GitHub!" -ForegroundColor Red
Write-Host "Caso não exista, crie-o em: https://github.com/new" -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para continuar"

try {
    git push -u origin master
    Write-Host ""
    Write-Host "[4/4] Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Seu projeto está agora disponível em:" -ForegroundColor Cyan
    Write-Host "https://github.com/$githubUser/RetroChat-Live" -ForegroundColor White
    Write-Host ""
    Write-Host "Para clonar em outro local:" -ForegroundColor Cyan
    Write-Host "git clone https://github.com/$githubUser/RetroChat-Live.git" -ForegroundColor White
} catch {
    Write-Host "Erro durante o push. Verifique:" -ForegroundColor Red
    Write-Host "1. Se o repositório existe no GitHub" -ForegroundColor Yellow
    Write-Host "2. Se você tem permissões de escrita" -ForegroundColor Yellow
    Write-Host "3. Se suas credenciais estão corretas" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Pressione Enter para sair"