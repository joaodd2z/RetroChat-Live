@echo off
echo ========================================
echo    🚀 RETROCHAT-LIVE DEPLOY FINAL
echo ========================================
echo.

echo ✅ Verificando arquivos essenciais...
if not exist "vercel.json" (
    echo ❌ ERRO: vercel.json não encontrado!
    pause
    exit /b 1
)

if not exist ".env.example" (
    echo ❌ ERRO: .env.example não encontrado!
    pause
    exit /b 1
)

if not exist "src\config\firebase.js" (
    echo ❌ ERRO: firebase.js não encontrado!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos essenciais estão presentes!
echo.

echo 📦 Adicionando arquivos ao Git...
git add .

echo 📝 Criando commit...
git commit -m "🚀 Deploy completo: Firebase + WordPress + Vercel + Streams automáticos"

echo 🚀 Enviando para GitHub...
git push origin master

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    ✅ DEPLOY ENVIADO COM SUCESSO!
    echo ========================================
    echo.
    echo 🎯 PRÓXIMOS PASSOS:
    echo.
    echo 1. Acesse: https://vercel.com/dashboard
    echo 2. Clique em "New Project"
    echo 3. Selecione "RetroChat-Live"
    echo 4. Configure as variáveis de ambiente:
    echo    - REACT_APP_ADMIN_USERNAME=joaodd2
    echo    - REACT_APP_ADMIN_PASSWORD=Killer007@
    echo 5. Clique em "Deploy"
    echo.
    echo 🔥 FUNCIONALIDADES INCLUÍDAS:
    echo ✅ Chat com histórico Firebase
    echo ✅ Streams automáticos de futebol
    echo ✅ Painel admin (Ctrl+Shift+A)
    echo ✅ Integração WordPress
    echo ✅ Automação inteligente
    echo ✅ Interface responsiva
    echo.
    echo 🎮 Login Admin: joaodd2 / Killer007@
    echo.
    echo ========================================
    echo    🌟 RETROCHAT-LIVE ESTÁ PRONTO!
    echo ========================================
) else (
    echo.
    echo ❌ ERRO no push para GitHub!
    echo Verifique sua conexão e tente novamente.
)

echo.
echo Pressione qualquer tecla para continuar...
pause > nul