@echo off
chcp 65001 >nul
title Servidor Local Nexus Vault - Deo Magalhães
echo ==========================================================
echo   Iniciando Servidor Web Local e Sincronizacao ao Vivo...
echo   URL: http://localhost:8080/nexus-vault/
echo ==========================================================
cd /d "%~dp0"
start http://localhost:8080/nexus-vault/
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\server.ps1
