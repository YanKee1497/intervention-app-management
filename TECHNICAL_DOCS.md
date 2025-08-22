# Documentation Technique - Application de Gestion des Demandes

## 📋 Vue d'ensemble du Projet

### Architecture
```
Frontend (React) ←→ Backend (Express.js) ←→ Base de Données (SQLite)
     Port 3000           Port 5000              intervention_app.db
```

### Technologies utilisées
- **Frontend**: React.js, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js, SQLite3, JWT, bcryptjs
- **Base de données**: SQLite avec 5 tables principales

## 🚀 Installation et Démarrage

### Méthode rapide (Windows)
```bash
# Cloner le projet et naviguer dans le dossier
cd intervention-app

# Exécuter le script de démarrage
start.bat
```

### Méthode manuelle
```bash
# Backend
cd backend
npm install
npm start  # Port 5000

# Frontend (nouveau terminal)
cd frontend  
npm install
npm start  # Port 3000
```

### Comptes de test
| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@entreprise.com | password123 |
| Manager | manager@entreprise.com | password123 |
| Technicien | technicien1@entreprise.com | password123 |
| Employé | employe1@entreprise.com | password123 |

## 🗂️ Structure de la Base de Données

### Table `users`
```sql
id (PK) | email | password | firstname | lastname | role | is_available | created_at | updated_at
```
- Rôles: `employee`, `technician`, `manager`, `admin`
- `is_available`: Disponibilité du technicien

### Table `services`
```sql
id (PK) | name | description | icon | created_at
```
- Services par défaut: Maintenance, Informatique, Logistique, Nettoyage, Sécurité

### Table `tickets`
```sql
id (PK) | ticket_number | title | description | urgency | status | service_id (FK) | 
employee_id (FK) | technician_id (FK) | attachment_path | created_at | updated_at | resolved_at
```
- Statuts: `pending`, `assigned`, `in_progress`, `resolved`, `rejected`
- Urgence: `low`, `medium`, `high`, `critical`
- Numérotation automatique: `SERVICE-YYYY-NNNN` (ex: MAINT-2025-0001)

### Table `ticket_comments`
```sql
id (PK) | ticket_id (FK) | user_id (FK) | comment | status_change | created_at
```

### Table `notifications`
```sql
id (PK) | user_id (FK) | ticket_id (FK) | message | is_read | created_at
```

## 🔌 API Endpoints

### Authentification (`/api/auth`)
```javascript
POST   /login         // Connexion
POST   /register      // Inscription
GET    /profile       // Profil utilisateur
PUT    /availability  // Disponibilité technicien
```

### Tickets (`/api/tickets`)
```javascript
GET    /              // Mes tickets (selon rôle)
POST   /              // Créer ticket (employé)
GET    /available     // Tickets disponibles (technicien)
GET    /stats         // Statistiques (manager/admin)
GET    /:id           // Détail ticket
PUT    /:id/take      // Prendre en charge (technicien)
PUT    /:id/assign    // Assigner (manager/admin)
PUT    /:id/status    // Mettre à jour statut
```

### Services (`/api/services`)
```javascript
GET    /              // Liste services
GET    /:id           // Détail service
POST   /              // Créer service (admin)
PUT    /:id           // Modifier service (admin)
DELETE /:id           // Supprimer service (admin)
GET    /:id/stats     // Stats service (manager/admin)
```

## 🎨 Interface Utilisateur

### Composants principaux
- `AuthContext`: Gestion de l'authentification globale
- `Navbar`: Barre de navigation avec profil utilisateur
- `Dashboard`: Page principale adaptée par rôle
- `TicketCard`: Affichage d'un ticket
- `CreateTicketModal`: Formulaire de création de ticket

### Styles CSS
- Variables CSS centralisées dans `global.css`
- Design responsive mobile-first
- Système de couleurs cohérent (bleu/gris)
- Badges colorés pour statuts et urgences

### Pages par rôle

#### Employé
- Dashboard avec ses tickets (En attente, En cours, Résolues)
- Bouton "Nouvelle demande"
- Suivi en temps réel

#### Technicien
- Tickets disponibles à prendre en charge
- Ses tickets en cours
- Gestion de disponibilité

#### Manager/Admin
- Vue globale de tous les tickets
- Statistiques et rapports
- Assignation de tickets

## 🔐 Sécurité

### Authentification JWT
```javascript
// Headers requis pour routes protégées
Authorization: Bearer <token>
```

### Middlewares
- `authenticateToken`: Vérification JWT
- `authorizeRoles`: Contrôle d'accès par rôle

### Hashage des mots de passe
- bcryptjs avec salt rounds = 12
- Stockage sécurisé en base

## 📊 Gestion des Statuts

### Workflow standard
```
Employé crée → pending → Technicien prend → in_progress → resolved
                     ↘ Manager assigne → assigned → in_progress → resolved
```

### Transitions autorisées
- `pending` → `assigned`, `in_progress`, `rejected`
- `assigned` → `in_progress`, `rejected`
- `in_progress` → `resolved`, `rejected`

## 🛠️ Configuration

### Variables d'environnement Backend (.env)
```env
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Variables d'environnement Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=InterventionApp
```

## 🔧 Développement

### Ajout d'un nouveau rôle
1. Modifier la contrainte CHECK dans la table `users`
2. Ajouter la logique dans `authorizeRoles`
3. Créer l'interface utilisateur spécifique
4. Mettre à jour les permissions API

### Ajout d'un nouveau statut
1. Modifier la contrainte CHECK dans la table `tickets`
2. Ajouter les styles CSS correspondants
3. Mettre à jour les workflows
4. Ajouter la traduction française

### Nouveaux services
Interface admin pour gérer dynamiquement les services sans modification de code.

## 📱 Évolutions Futures

### Court terme
- [ ] Upload de fichiers joints
- [ ] Notifications en temps réel (WebSocket)
- [ ] Recherche et filtres avancés
- [ ] Historique détaillé des tickets

### Moyen terme
- [ ] Application mobile React Native
- [ ] Chat intégré employé-technicien
- [ ] Rapports PDF/Excel
- [ ] Intégration email (SMTP)

### Long terme
- [ ] IA pour assignation automatique
- [ ] Géolocalisation pour interventions
- [ ] Intégration calendriers (Outlook, Google)
- [ ] Analytics avancées avec tableaux de bord

## 🐛 Debugging

### Logs backend
```bash
cd backend
npm start
# Logs dans la console avec DEBUG=*
```

### Problèmes courants
1. **Port déjà utilisé**: Modifier PORT dans .env
2. **Base de données corrompue**: Supprimer `database/intervention_app.db`
3. **CORS**: Vérifier FRONTEND_URL dans backend/.env
4. **JWT expiré**: Se reconnecter

### Tests API avec curl
```bash
# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@entreprise.com","password":"password123"}'

# Obtenir tickets (avec token)
curl -X GET http://localhost:5000/api/tickets \
  -H "Authorization: Bearer <token>"
```

## 📋 Checklist de Production

- [ ] Changer JWT_SECRET
- [ ] Utiliser PostgreSQL/MySQL au lieu de SQLite
- [ ] Configurer HTTPS
- [ ] Ajouter rate limiting
- [ ] Configurer logs (Winston)
- [ ] Backup automatique de la base
- [ ] Monitoring (uptime, performances)
- [ ] Tests automatisés
- [ ] CI/CD pipeline
- [ ] Documentation API (Swagger)

## 👥 Équipe de Développement

Pour contribuer au projet :
1. Fork et clone le repository
2. Créer une branche feature
3. Respecter les conventions de nommage
4. Tester localement
5. Créer une Pull Request

## 📞 Support

En cas de problème :
- Vérifier les logs backend/frontend
- Consulter cette documentation
- Créer une issue GitHub avec détails de reproduction
