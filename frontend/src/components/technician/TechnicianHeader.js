import React, { useState, useRef, useEffect } from 'react';
import './TechnicianHeader.css';

const TechnicianHeader = ({ user, notifications = 0, onLogout, onProfileClick, onSettingsClick, onNotificationClick, onViewAllNotifications, onSearch }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Fermer les menus si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Générer les initiales de l'utilisateur
  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    if (onNotificationClick) onNotificationClick();
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const handleProfileToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMenuItemClick = (action) => {
    setShowProfileMenu(false);
    if (action === 'profile' && onProfileClick) onProfileClick();
    if (action === 'settings' && onSettingsClick) onSettingsClick();
    if (action === 'logout' && onLogout) onLogout();
  };

  const userName = user?.firstname && user?.lastname ? 
    `${user.firstname} ${user.lastname}` : 
    user?.email?.split('@')[0] || 'Technicien';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Section gauche - Logo et nom */}
        <div className="header-left">
          <div className="logo-section">
            <div className="app-logo">
              🎯
            </div>
            <h1 className="app-name">InterventionPro</h1>
          </div>
        </div>

        {/* Section centrale - Recherche */}
        <div className="header-center">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher un ticket..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* Section droite - Notifications et profil */}
        <div className="header-right">
          {/* Notifications */}
          <div className="notifications-container" ref={notificationRef}>
            <button 
              className="notification-btn" 
              onClick={handleNotificationToggle}
              title="Notifications"
            >
              <span className="notification-icon">🔔</span>
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>

            {/* Menu des notifications */}
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
                          <p>Rappel: Ticket #TCK-003 en attente</p>
                          <span className="notification-time">Il y a 15 min</span>
                        </div>
                      </div>
                      <div className="notification-item">
                        <span className="notification-icon">✅</span>
                        <div className="notification-content">
                          <p>Ticket #TCK-001 marqué comme résolu</p>
                          <span className="notification-time">Il y a 1h</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="no-notifications">
                      <span className="no-notif-icon">📭</span>
                      <p>Aucune nouvelle notification</p>
                    </div>
                  )}
                </div>
                <div className="notification-footer">
                  <button 
                    className="view-all-notifications"
                    onClick={() => {
                      setShowNotifications(false);
                      if (onViewAllNotifications) onViewAllNotifications();
                    }}
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profil utilisateur */}
          <div className="profile-container" ref={profileMenuRef}>
            <button 
              className="profile-btn" 
              onClick={handleProfileToggle}
              title={`${userName} - Cliquez pour le menu`}
            >
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(userName)}
                  </span>
                )}
              </div>
              <span className="profile-name">
                {userName}
              </span>
              <span className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`}>
                ▼
              </span>
            </button>

            {/* Menu déroulant */}
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-name">{userName}</div>
                    <div className="user-role">Technicien</div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => handleMenuItemClick('profile')}
                  >
                    <span className="item-icon">👤</span>
                    <span>Mon profil</span>
                  </button>
                  
                  <button 
                    className="dropdown-item"
                    onClick={() => handleMenuItemClick('settings')}
                  >
                    <span className="item-icon">⚙️</span>
                    <span>Paramètres</span>
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item"
                    onClick={() => handleMenuItemClick('logout')}
                  >
                    <span className="item-icon">🚪</span>
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TechnicianHeader;
