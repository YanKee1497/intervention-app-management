require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Initialiser la base de données
const { initDatabase } = require('./database/init');
const { createTestUsers } = require('./database/seedUsers');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var ticketsRouter = require('./routes/tickets');
var servicesRouter = require('./routes/services');

var app = express();

// Initialiser la base de données au démarrage
initDatabase().then(() => {
  console.log('Application prête');
  
  // Créer les utilisateurs de test en mode développement
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      createTestUsers();
    }, 1000);
  }
}).catch(err => {
  console.error('Erreur lors de l\'initialisation de la base de données:', err);
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/services', servicesRouter);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

module.exports = app;
