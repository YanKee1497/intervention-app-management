import React, { useState, useEffect } from 'react';
import './UserProfileModal.css';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    service: user?.service || '',
    role: user?.role || '',
    telephone: user?.telephone || '',
    dateEmbauche: user?.dateEmbauche || '2023-01-15',
    manager: user?.manager || 'Jean Dupont'
  });

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150); // Durée de l'animation de fermeture plus rapide
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Ici, on sauvegarderait les données
    console.log('Sauvegarde du profil:', formData);
    setIsEditing(false);
    // Simulation d'une notification de succès
    alert('Profil mis à jour avec succès !');
  };

  const handleCancel = () => {
    // Restaurer les données originales
    setFormData({
      prenom: user?.prenom || '',
      nom: user?.nom || '',
      email: user?.email || '',
      service: user?.service || '',
      role: user?.role || '',
      telephone: user?.telephone || '',
      dateEmbauche: user?.dateEmbauche || '2023-01-15',
      manager: user?.manager || 'Jean Dupont'
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (formData.prenom && formData.nom) {
      return `${formData.prenom} ${formData.nom}`;
    }
    return 'Utilisateur';
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Administrateur',
      'manager': 'Manager', 
      'employee': 'Employé',
      'support': 'Support IT'
    };
    return roleMap[role] || role;
  };

  return (
    <div className={`profile-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`profile-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <h2>Mon Profil</h2>
          </div>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="profile-modal-body">
          {/* Section Avatar et Info de base */}
          <div className="profile-header-section">
            <div className="profile-avatar-large">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <span className="avatar-initials-large">
                  {getInitials(getUserDisplayName())}
                </span>
              )}
              <button className="avatar-edit-btn" title="Changer la photo">
                📷
              </button>
            </div>
            <div className="profile-header-info">
              <h3>{getUserDisplayName()}</h3>
              <p className="user-role">{getRoleDisplayName(formData.role)}</p>
              <p className="user-service">{formData.service}</p>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="profile-section">
            <div className="section-header">
              <h4>Informations personnelles</h4>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Modifier
                </button>
              )}
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{formData.prenom}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{formData.nom}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{formData.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+33 1 23 45 67 89"
                    />
                  ) : (
                    <div className="form-value">{formData.telephone || 'Non renseigné'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="profile-section">
            <div className="section-header">
              <h4>Informations professionnelles</h4>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Service</label>
                  <div className="form-value">{formData.service}</div>
                </div>
                <div className="form-group">
                  <label>Rôle</label>
                  <div className="form-value">{getRoleDisplayName(formData.role)}</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date d'embauche</label>
                  <div className="form-value">
                    {new Date(formData.dateEmbauche).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label>Manager</label>
                  <div className="form-value">{formData.manager}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="profile-section">
            <div className="section-header">
              <h4>Statistiques</h4>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">42</div>
                <div className="stat-label">Tickets créés</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">38</div>
                <div className="stat-label">Tickets résolus</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.2</div>
                <div className="stat-label">Note moyenne</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2h 30m</div>
                <div className="stat-label">Temps moyen</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="profile-modal-footer">
          {isEditing ? (
            <div className="edit-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Annuler
              </button>
              <button className="btn-save" onClick={handleSave}>
                💾 Sauvegarder
              </button>
            </div>
          ) : (
            <button className="btn-close" onClick={handleClose}>
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
