@echo off
echo ========================================
echo    RetroLive - Deploy para GitHub
echo ========================================
echo.

echo [1/4] Verificando status do repositorio...
git status
echo.

echo [2/4] Configurando remote origin...
set /p GITHUB_USER="Digite seu nome de usuario do GitHub: "
git remote add origin https://github.com/%GITHUB_USER%/RetroLive.git
echo Remote configurado para: https://github.com/%GITHUB_USER%/RetroLive.git
echo.

echo [3/4] Fazendo push para o GitHub...
echo IMPORTANTE: Certifique-se de que o repositorio 'RetroLive' existe no seu GitHub!
echo Caso nao exista, crie-o em: https://github.com/new
echo.
pause

git push -u origin master
echo.

echo [4/4] Deploy concluido!
echo.
echo Seu projeto esta agora disponivel em:
echo https://github.com/%GITHUB_USER%/RetroLive
echo.
echo Para clonar em outro local:
echo git clone https://github.com/%GITHUB_USER%/RetroLive.git
echo.
pause