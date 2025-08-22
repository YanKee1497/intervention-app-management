# Application de Gestion des Demandes d'Intervention et de Service

Une application web complète pour gérer les demandes d'intervention et de service dans une entreprise, avec des rôles différenciés pour employés, techniciens, managers et administrateurs.

## 🚀 Fonctionnalités

### Pour les Employés
- ✅ Créer de nouvelles demandes d'intervention
- ✅ Suivre l'état de leurs demandes (en attente, en cours, résolues)
- ✅ Recevoir des notifications de mise à jour
- ✅ Voir le nombre de techniciens disponibles lors de la création

### Pour les Techniciens
- ✅ Voir les demandes disponibles (non assignées)
- ✅ Prendre en charge une demande directement
- ✅ Gérer leurs demandes en cours
- ✅ Mettre à jour le statut des interventions
- ✅ Indiquer leur disponibilité

### Pour les Managers
- ✅ Superviser toutes les demandes
- ✅ Assigner ou réassigner des demandes aux techniciens
- ✅ Voir les statistiques globales
- ✅ Suivre les performances et délais

### Pour les Administrateurs
- ✅ Gestion complète des utilisateurs et rôles
- ✅ Configuration des services disponibles
- ✅ Paramètres globaux de l'application
- ✅ Accès à tous les rapports

## 🛠️ Technologies

### Backend
- **Node.js** avec Express.js
- **SQLite** pour la base de données
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **CORS** pour les requêtes cross-origin

### Frontend
- **React.js** (Create React App)
- **React Router** pour la navigation
- **Axios** pour les appels API
- **CSS3** avec variables CSS natives
- **PWA** ready (Progressive Web App)

## 📦 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd intervention-app
```

2. **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Modifier le fichier .env avec vos paramètres
npm start
```

3. **Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Modifier le fichier .env si nécessaire
npm start
```

### Démarrage
- Backend : http://localhost:5000
- Frontend : http://localhost:3000

## 🗂️ Structure du Projet

```
intervention-app/
├── backend/
│   ├── controllers/         # Contrôleurs API
│   ├── models/             # Modèles de données
│   ├── routes/             # Routes API
│   ├── middleware/         # Middlewares (auth, etc.)
│   ├── database/           # Configuration et init DB
│   ├── config/             # Configurations
│   └── app.js              # Point d'entrée
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages de l'application
│   │   ├── context/        # Context API (Auth)
│   │   ├── services/       # Services API
│   │   ├── styles/         # Fichiers CSS
│   │   └── utils/          # Utilitaires
│   └── public/             # Fichiers statiques
└── README.md
```

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Palette bleu/gris avec couleurs de statut
- **Typography** : Système de polices cohérent
- **Composants** : Cards, badges, boutons avec états hover/focus
- **Responsive** : Interface adaptative mobile/desktop

### Écrans Principaux
1. **Connexion** - Authentification sécurisée
2. **Dashboard** - Vue d'ensemble personnalisée par rôle
3. **Création de ticket** - Formulaire complet avec services
4. **Gestion des tickets** - Interface selon les permissions

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/availability` - Mise à jour disponibilité

### Tickets
- `GET /api/tickets` - Liste des tickets (selon rôle)
- `POST /api/tickets` - Créer un ticket
- `GET /api/tickets/available` - Tickets disponibles
- `PUT /api/tickets/:id/take` - Prendre en charge
- `PUT /api/tickets/:id/assign` - Assigner
- `PUT /api/tickets/:id/status` - Mettre à jour statut

### Services
- `GET /api/services` - Liste des services
- `POST /api/services` - Créer un service (admin)
- `PUT /api/services/:id` - Modifier un service (admin)
- `DELETE /api/services/:id` - Supprimer un service (admin)

## 🔐 Gestion des Rôles

| Fonctionnalité | Employé | Technicien | Manager | Admin |
|----------------|---------|------------|---------|-------|
| Créer ticket | ✅ | ❌ | ❌ | ❌ |
| Voir ses tickets | ✅ | ✅ | ✅ | ✅ |
| Prendre en charge | ❌ | ✅ | ❌ | ❌ |
| Assigner tickets | ❌ | ❌ | ✅ | ✅ |
| Voir tous tickets | ❌ | ❌ | ✅ | ✅ |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ✅ |
| Gérer services | ❌ | ❌ | ❌ | ✅ |

## 📊 Base de Données

### Tables Principales
- **users** - Utilisateurs avec rôles
- **services** - Services disponibles
- **tickets** - Demandes d'intervention
- **ticket_comments** - Historique et commentaires
- **notifications** - Notifications utilisateurs

### Statuts des Tickets
- `pending` - En attente d'affectation
- `assigned` - Assigné mais pas commencé
- `in_progress` - En cours de traitement
- `resolved` - Résolu avec succès
- `rejected` - Rejeté ou annulé

### Niveaux d'Urgence
- `low` - Faible priorité
- `medium` - Priorité normale
- `high` - Priorité élevée
- `critical` - Critique, intervention immédiate

## 🔄 Workflow Type

1. **Employé** crée une demande avec service, titre, description, urgence
2. **Système** génère un numéro de ticket unique (ex: MAINT-2025-0001)
3. **Technicien** disponible peut prendre en charge → statut "En cours"
4. **Technicien** termine l'intervention → statut "Résolu"
5. **Employé** reçoit notification de résolution

## 🚧 Évolutions Futures

- [ ] Chat temps réel entre employé et technicien
- [ ] Upload et gestion de fichiers joints
- [ ] Notifications push et email
- [ ] Export PDF/Excel des rapports
- [ ] Géolocalisation pour interventions sur site
- [ ] Application mobile React Native
- [ ] Intégration calendrier (Outlook, Google)
- [ ] Système de tickets récurrents
- [ ] Analytics avancées avec graphiques
- [ ] API REST complète pour intégrations tierces

## 📝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé avec ❤️ pour améliorer la gestion des interventions en entreprise.

## 🆘 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation technique
- Vérifier les logs du backend/frontend
