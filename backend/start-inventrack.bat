
@echo off

echo ====================================
echo     Starting InvenTrack
echo ====================================

:: Jalankan Backend
start "InvenTrack Backend" cmd /k "cd /d D:\september\InvenTrack\backend && npm run dev"

:: Jalankan Frontend
start "InvenTrack Frontend" cmd /k "cd /d D:\september\InvenTrack\frontend && npm run dev -- --host 0.0.0.0"

exit
