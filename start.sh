# Script de démarrage pour Unix/Linux/Mac
#!/bin/bash

echo "========================================"
echo "   Application de Gestion des Demandes"
echo "========================================"
echo

echo "[1/3] Démarrage du backend (port 5000)..."
cd backend && npm start &
BACKEND_PID=$!
sleep 3

echo "[2/3] Démarrage du frontend (port 3000)..."
cd ../frontend && npm start &
FRONTEND_PID=$!
sleep 5

echo "[3/3] Ouverture dans le navigateur..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
fi

echo
echo "========================================"
echo "  Application démarrée avec succès!"
echo "========================================"
echo "Backend API: http://localhost:5000"
echo "Frontend:    http://localhost:3000"
echo
echo "Comptes de test disponibles:"
echo "- Admin:       admin@entreprise.com / password123"
echo "- Manager:     manager@entreprise.com / password123"
echo "- Technicien:  technicien1@entreprise.com / password123"
echo "- Employé:     employe1@entreprise.com / password123"
echo
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre que l'utilisateur appuie sur Ctrl+C
trap "echo 'Arrêt des serveurs...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
