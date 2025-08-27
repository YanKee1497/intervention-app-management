import React, { useState, useRef, useEffect } from 'react';
import UserProfileModal from './UserProfileModal';
import SettingsModal from './SettingsModal';
import './HeaderPro.css';

function HeaderPro({ user, notifications = 0, onLogout, onProfileClick, onSettingsClick, onSearch }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Fermer les menus si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
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
    setShowNotifications(false); // Fermer les notifications si ouvertes
    setShowLanguageMenu(false); // Fermer les langues si ouvert
  };

  const handleNotificationsToggle = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false); // Fermer le profil si ouvert
    setShowLanguageMenu(false); // Fermer les langues si ouvert
  };

  const handleLanguageToggle = () => {
    setShowLanguageMenu(!showLanguageMenu);
    setShowProfileMenu(false); // Fermer le profil si ouvert
    setShowNotifications(false); // Fermer les notifications si ouvertes
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
    // Ici on pourrait appeler une fonction pour changer la langue de l'app
    console.log('Langue changée vers:', langCode);
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // Données de démonstration pour les notifications
  const mockNotifications = [
    {
      id: 1,
      title: 'Nouveau ticket assigné',
      message: 'Le ticket TCK-007 vous a été assigné',
      time: '5 min',
      type: 'assignment',
      unread: true
    },
    {
      id: 2,
      title: 'Ticket résolu',
      message: 'Le ticket TCK-003 a été marqué comme résolu',
      time: '1h',
      type: 'resolution',
      unread: true
    },
    {
      id: 3,
      title: 'Nouveau commentaire',
      message: 'Un commentaire a été ajouté sur TCK-001',
      time: '2h',
      type: 'comment',
      unread: false
    },
    {
      id: 4,
      title: 'Maintenance planifiée',
      message: 'Maintenance serveur prévue demain à 14h',
      time: '3h',
      type: 'maintenance',
      unread: false
    },
    {
      id: 5,
      title: 'Mise à jour système',
      message: 'Le système sera mis à jour ce weekend',
      time: '1j',
      type: 'system',
      unread: false
    }
  ];

  const handleNotificationClick = (notificationId) => {
    console.log('Notification cliquée:', notificationId);
    // Marquer la notification comme lue
    const updatedNotifications = mockNotifications.map(notif => 
      notif.id === notificationId 
        ? { ...notif, unread: false }
        : notif
    );
    // Ici on mettrait à jour l'état global des notifications
    alert(`Notification ${notificationId} marquée comme lue !`);
  };

  const handleMarkAllAsRead = () => {
    console.log('Marquer toutes les notifications comme lues');
    // Marquer toutes les notifications comme lues
    const updatedNotifications = mockNotifications.map(notif => ({
      ...notif,
      unread: false
    }));
    alert('Toutes les notifications ont été marquées comme lues !');
  };

  const handleViewAllNotifications = () => {
    console.log('Voir toutes les notifications');
    setShowNotifications(false);
    alert('Redirection vers la page des notifications...');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment': return '📋';
      case 'resolution': return '✅';
      case 'comment': return '💬';
      case 'maintenance': return '🔧';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const handleMenuItemClick = (action) => {
    setShowProfileMenu(false);
    if (action === 'profile') {
      setShowProfileModal(true);
      if (onProfileClick) onProfileClick();
    }
    if (action === 'settings') {
      setShowSettingsModal(true);
      if (onSettingsClick) onSettingsClick();
    }
    if (action === 'logout' && onLogout) onLogout();
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
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
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Rechercher tickets, utilisateurs, ID..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    className="search-clear"
                    onClick={clearSearch}
                    title="Effacer la recherche"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Section droite - Notifications et profil */}
        <div className="header-right">
          {/* Notifications */}
          <div className="header-item notification-container" ref={notificationsRef}>
            <button 
              className={`icon-btn ${showNotifications ? 'active' : ''}`} 
              onClick={handleNotificationsToggle}
              title="Notifications"
            >
              <span className="icon">🔔</span>
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>

            {/* Dropdown des notifications */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button 
                    className="mark-all-read-btn"
                    onClick={handleMarkAllAsRead}
                    title="Marquer tout comme lu"
                  >
                    ✓
                  </button>
                </div>

                <div className="notifications-list">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                      {notification.unread && (
                        <div className="unread-indicator"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="notifications-footer">
                  <button 
                    className="view-all-btn"
                    onClick={handleViewAllNotifications}
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Langue */}
          <div className="header-item language-container" ref={languageMenuRef}>
            <button 
              className={`icon-btn ${showLanguageMenu ? 'active' : ''}`} 
              onClick={handleLanguageToggle}
              title="Changer la langue"
            >
              <span className="icon">{getCurrentLanguage().flag}</span>
            </button>

            {/* Dropdown des langues */}
            {showLanguageMenu && (
              <div className="language-dropdown">
                <div className="language-header">
                  <h3>Langue / Language</h3>
                </div>
                <div className="language-list">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className={`language-item ${currentLanguage === language.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      <span className="language-flag">{language.flag}</span>
                      <span className="language-name">{language.name}</span>
                      {currentLanguage === language.code && (
                        <span className="language-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

      {/* Modales */}
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={handleCloseProfileModal}
        user={user}
      />
      
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={handleCloseSettingsModal}
      />
    </header>
  );
}

export default HeaderPro;
