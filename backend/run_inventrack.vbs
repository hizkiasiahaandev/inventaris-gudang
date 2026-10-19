Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c ""cd /d D:\september\InvenTrack\backend && npm run dev""", 0, False
WshShell.Run "cmd /c ""cd /d D:\september\InvenTrack\frontend && npm run dev -- --host 0.0.0.0""", 0, False