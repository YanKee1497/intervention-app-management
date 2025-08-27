import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

function Header({ user, notifications = 0, onLogout, onProfileClick, onSettingsClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Générer les initiales de l'utilisateur
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
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

        {/* Section droite - Notifications et profil */}
        <div className="header-right">
          {/* Notifications */}
          <div className="notifications-container">
            <button className="notification-btn" title="Notifications">
              <span className="notification-icon">🔔</span>
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          </div>

          {/* Profil utilisateur */}
          <div className="profile-container" ref={profileMenuRef}>
            <button 
              className="profile-btn" 
              onClick={handleProfileToggle}
              title={`${user?.name || user?.email} - Cliquez pour le menu`}
            >
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(user?.name || user?.email)}
                  </span>
                )}
              </div>
              <span className="profile-name">
                {user?.name || user?.email?.split('@')[0]}
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
                    <div className="user-name">{user?.name || user?.email?.split('@')[0]}</div>
                    <div className="user-role">{user?.role || 'Employé'}</div>
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
}

export default Header;
