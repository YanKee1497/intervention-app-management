import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = ({ user, notifications, onToggleSidebar }) => {
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="admin-logo">
          <i className="fas fa-cogs"></i>
          <span>Administration GT</span>
        </div>
      </div>

      <div className="admin-header-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Rechercher utilisateurs, tickets, paramètres..."
            className="admin-search"
          />
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div className="admin-header-right">
        {/* Notifications */}
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications ({unreadCount})</h3>
                <button className="mark-all-read">
                  Tout marquer comme lu
                </button>
              </div>
              
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      <i className={`fas fa-${
                        notification.type === 'urgent' ? 'exclamation-triangle' :
                        notification.type === 'warning' ? 'exclamation-circle' :
                        'info-circle'
                      }`}></i>
                    </div>
                    
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">il y a {notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="notification-footer">
                <button className="view-all-notifications">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profil utilisateur */}
        <div className="profile-container">
          <button 
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="profile-info">
              <span className="profile-name">{user.prenom} {user.nom}</span>
              <span className="profile-role">Administrateur</span>
            </div>
            <i className="fas fa-chevron-down"></i>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div>
                  <h3>{user.prenom} {user.nom}</h3>
                  <p>{user.email}</p>
                  <span className="role-badge admin">Administrateur</span>
                </div>
              </div>
              
              <div className="profile-menu">
                <button className="profile-menu-item">
                  <i className="fas fa-user-cog"></i>
                  Profil & Préférences
                </button>
                <button className="profile-menu-item">
                  <i className="fas fa-key"></i>
                  Sécurité & Mot de passe
                </button>
                <button className="profile-menu-item">
                  <i className="fas fa-history"></i>
                  Journal d'activité
                </button>
                <hr />
                <button className="profile-menu-item logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
