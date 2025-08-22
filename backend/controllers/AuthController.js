const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class AuthController {
  // Connexion
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      User.findByEmail(email, async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            is_available: user.is_available
          }
        });
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Inscription
  static async register(req, res) {
    try {
      const { email, password, firstname, lastname, role } = req.body;

      if (!email || !password || !firstname || !lastname || !role) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }

      if (!['employee', 'technician', 'manager', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      // Vérifier si l'email existe déjà
      User.findByEmail(email, async (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (existingUser) {
          return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        const userData = {
          email,
          password: hashedPassword,
          firstname,
          lastname,
          role
        };

        User.create(userData, (err, userId) => {
          if (err) {
            console.error('Erreur lors de la création de l\'utilisateur:', err);
            return res.status(500).json({ error: 'Erreur lors de la création du compte' });
          }

          res.status(201).json({
            message: 'Compte créé avec succès',
            userId
          });
        });
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Obtenir le profil de l'utilisateur connecté
  static getProfile(req, res) {
    User.findById(req.user.userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user);
    });
  }

  // Mettre à jour la disponibilité (pour les techniciens)
  static updateAvailability(req, res) {
    const { is_available } = req.body;

    if (req.user.role !== 'technician') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    User.updateAvailability(req.user.userId, is_available, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
      }

      res.json({ message: 'Disponibilité mise à jour' });
    });
  }
}

module.exports = AuthController;
