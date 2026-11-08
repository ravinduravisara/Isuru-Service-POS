@echo off
REM ==============================================================================
REM ISURU SERVICE CENTER POS: WINDOWS APPLICATION LAUNCHER
REM ==============================================================================
title ISURU Service Center POS Launcher

echo =================================================================
echo    ISURU SERVICE CENTER: STARTING LOCAL POS TERMINAL
echo =================================================================

cd /d "%~dp0\..\.."

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not found in PATH. Please install or start Docker Desktop.
    pause
    exit /b 1
)

echo Starting local POS Docker Compose stack...
docker compose -f compose.yaml up -d

echo Waiting for local POS backend to become ready...
timeout /t 5 /nobreak >nul

echo Opening ISURU POS in browser...
start http://localhost:8081

echo =================================================================
echo [OK] POS is running. Local billing operates without internet.
echo =================================================================
