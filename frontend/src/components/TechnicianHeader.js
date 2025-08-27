import React, { useState } from 'react';
import '../styles/TechnicianHeader.css';

const TechnicianHeader = ({ user, onSearch, notifications = 0, onProfileAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleNotificationsToggle = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <header className="technician-header">
      {/* Logo et nom de l'entreprise */}
      <div className="header-left">
        <div className="company-logo">
          <span className="logo-icon">🔧</span>
          <span className="company-name">TechService Pro</span>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="header-center">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un ticket (numéro, mot-clé...)"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                if (onSearch) onSearch('');
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Notifications et profil */}
      <div className="header-right">
        {/* Notifications */}
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={handleNotificationsToggle}
            title="Notifications"
          >
            🔔
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <span className="notification-count">{notifications} nouvelles</span>
              </div>
              <div className="notification-list">
                {notifications > 0 ? (
                  <>
                    <div className="notification-item">
                      <span className="notification-icon">🆕</span>
                      <div className="notification-content">
                        <p>Nouveau ticket urgent assigné</p>
                        <span className="notification-time">Il y a 2 min</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <span className="notification-icon">⏰</span>
                      <div className="notification-content">
                        <p>Ticket #TCK-001 en attente</p>
                        <span className="notification-time">Il y a 15 min</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-notifications">
                    <span>📭</span>
                    <p>Aucune nouvelle notification</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Menu profil */}
        <div className="profile-container">
          <button 
            className="profile-btn"
            onClick={handleProfileMenuToggle}
            title="Menu profil"
          >
            <div className="profile-avatar">
              {user?.photo ? (
                <img src={user.photo} alt="Avatar" />
              ) : (
                <span className="profile-initials">
                  {getInitials(user?.firstname, user?.lastname)}
                </span>
              )}
            </div>
            <span className="profile-name">{user?.firstname}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-avatar-large">
                  {user?.photo ? (
                    <img src={user.photo} alt="Avatar" />
                  ) : (
                    <span className="profile-initials">
                      {getInitials(user?.firstname, user?.lastname)}
                    </span>
                  )}
                </div>
                <div className="profile-details">
                  <h4>{user?.firstname} {user?.lastname}</h4>
                  <p>{user?.email}</p>
                  <span className="role-badge">TECHNICIEN</span>
                </div>
              </div>
              <div className="profile-menu">
                <button 
                  className="menu-item"
                  onClick={() => onProfileAction?.('profile')}
                >
                  👤 Mon Profil
                </button>
                <button 
                  className="menu-item"
                  onClick={() => onProfileAction?.('settings')}
                >
                  ⚙️ Paramètres
                </button>
                <hr className="menu-divider" />
                <button 
                  className="menu-item logout"
                  onClick={() => onProfileAction?.('logout')}
                >
                  🚪 Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TechnicianHeader;
