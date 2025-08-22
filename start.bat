@echo off
echo ========================================
echo     Application de Gestion des Demandes
echo ========================================
echo.

echo [1/3] Demarrage du backend (port 5000)...
cd backend
start "Backend API" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [2/3] Demarrage du frontend (port 3000)...
cd ..\frontend
start "Frontend React" cmd /k "npm start"
timeout /t 2 /nobreak >nul

echo [3/3] Ouverture dans le navigateur...
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   Application demarree avec succes!
echo ========================================
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Comptes de test disponibles:
echo - Admin:       admin@entreprise.com / password123
echo - Manager:     manager@entreprise.com / password123  
echo - Technicien:  technicien1@entreprise.com / password123
echo - Employe:     employe1@entreprise.com / password123
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
