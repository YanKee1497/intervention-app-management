import React from 'react';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 Mon Profil</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <span className="avatar-initials-large">
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </span>
              )}
            </div>
            <button className="change-avatar-btn">📷 Changer la photo</button>
          </div>

          <div className="profile-info">
            <div className="info-section">
              <h3>📋 Informations personnelles</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Prénom:</label>
                  <span>{user?.firstname || 'Non renseigné'}</span>
                </div>
                <div className="info-item">
                  <label>Nom:</label>
                  <span>{user?.lastname || 'Non renseigné'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user?.email || 'Non renseigné'}</span>
                </div>
                <div className="info-item">
                  <label>Rôle:</label>
                  <span className="role-badge">🔧 Technicien</span>
                </div>
                <div className="info-item">
                  <label>Département:</label>
                  <span>{user?.department || 'Support technique'}</span>
                </div>
                <div className="info-item">
                  <label>Téléphone:</label>
                  <span>{user?.phone || 'Non renseigné'}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>📊 Statistiques</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Tickets résolus</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">En cours</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">96%</span>
                  <span className="stat-label">Taux de résolution</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2.3h</span>
                  <span className="stat-label">Temps moyen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
          <button className="btn-primary">
            ✏️ Modifier le profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
