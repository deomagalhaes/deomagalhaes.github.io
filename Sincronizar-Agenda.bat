@echo off
chcp 65001 >nul
title Sincronizador Google Calendar - Deo Magalhães
echo ==========================================================
echo   Sincronizando Google Agenda com o Nexus Vault...
echo ==========================================================
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\sync-agenda-vault.ps1
echo.
echo ==========================================================
echo   Sincronizacao concluida!
echo   Pressione qualquer tecla para fechar esta janela.
echo ==========================================================
pause >nul
