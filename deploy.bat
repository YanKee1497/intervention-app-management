@echo off
echo ==========================================
echo   SAUVEGARDE ET DEPLOIEMENT DU PROJET
echo ==========================================
echo.

echo [1/4] Verification du statut Git...
git status --short

echo.
echo [2/4] Affichage des derniers commits...
git log --oneline -5

echo.
echo [3/4] Informations du projet:
echo - Nom: Application de Gestion des Demandes
echo - Version: 1.0.0
echo - Backend: Node.js/Express (Port 5000)
echo - Frontend: React.js (Port 3000)
echo - Base de donnees: SQLite
echo - Authentification: JWT
echo.

echo [4/4] Options de sauvegarde disponibles:
echo.
echo 🔗 GITHUB (Recommande):
echo 1. Creer un repo sur https://github.com/new
echo 2. Copier l'URL du repo
echo 3. Executer:
echo    git remote add origin [URL_DU_REPO]
echo    git branch -M main
echo    git push -u origin main
echo.

echo 💾 SAUVEGARDE LOCALE:
echo - Le projet est pret dans: %CD%
echo - Utiliser "git bundle" pour une sauvegarde portable:
echo   git bundle create backup.bundle HEAD master
echo.

echo 🚀 DEPLOIEMENT CLOUD:
echo - Heroku: Voir TECHNICAL_DOCS.md section production
echo - Vercel: Pour le frontend React
echo - Railway: Pour l'app complete
echo.

echo ==========================================
echo   COMPTES DE TEST DISPONIBLES:
echo ==========================================
echo 👑 Admin:       admin@entreprise.com / password123
echo 👔 Manager:     manager@entreprise.com / password123
echo 🔧 Technicien:  technicien1@entreprise.com / password123
echo 👤 Employe:     employe1@entreprise.com / password123
echo ==========================================
echo.

echo Appuyez sur une touche pour continuer...
pause >nul
