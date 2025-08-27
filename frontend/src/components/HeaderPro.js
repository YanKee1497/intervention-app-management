import React, { useState, useRef, useEffect } from 'react';
import './HeaderPro.css';

function HeaderPro({ user, notifications = 0, onLogout, onProfileClick, onSettingsClick, onSearch }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const getUserDisplayName = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  return (
    <header className="header-pro">
      <div className="header-pro-container">
        {/* Section gauche - Logo et recherche */}
        <div className="header-left">
          {/* Logo */}
          <div className="logo-section">
            <div className="app-logo">
              🎯
            </div>
            <span className="app-name">GT System</span>
          </div>

          {/* Champ de recherche global */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text"
                className="search-input"
                placeholder="Rechercher un ticket…"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {/* Section droite - Notifications et profil */}
        <div className="header-right">
          {/* Notifications */}
          <div className="header-item">
            <button className="icon-btn" title="Notifications">
              <span className="icon">🔔</span>
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          </div>

          {/* Langue (optionnel) */}
          <div className="header-item">
            <button className="icon-btn" title="Langue">
              <span className="icon">🌍</span>
            </button>
          </div>

          {/* Profil utilisateur */}
          <div className="profile-container" ref={profileMenuRef}>
            <button 
              className="profile-btn" 
              onClick={handleProfileToggle}
              title="Profil utilisateur"
            >
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(getUserDisplayName())}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <span className="profile-name">{getUserDisplayName()}</span>
                <span className="profile-role">{user?.role || 'Employé'}</span>
              </div>
              <span className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`}>
                ▼
              </span>
            </button>

            {/* Menu déroulant */}
            {showProfileMenu && (
              <div className="profile-dropdown">
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

export default HeaderPro;
