@echo off
echo ====================================
echo    Stopping InvenTrack Services
echo ====================================

:: Mematikan semua proses Node.js yang berjalan
taskkill /F /IM node.exe /T

echo.
echo Service InvenTrack berhasil dihentikan.
pause
exit