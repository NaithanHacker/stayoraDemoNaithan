Write-Host "Starting STAYORA Django REST Backend on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
.\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000
