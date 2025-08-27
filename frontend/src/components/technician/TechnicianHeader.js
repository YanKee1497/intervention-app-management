import React, { useState } from 'react';
import './TechnicianHeader.css';

const TechnicianHeader = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const mockNotifications = [
    { id: 1, message: "Nouveau ticket assigné: TCK-009", time: "Il y a 5 min", read: false },
    { id: 2, message: "Ticket TCK-005 résolu", time: "Il y a 1h", read: true },
    { id: 3, message: "Rappel: Ticket TCK-003 en attente", time: "Il y a 2h", read: false }
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="technician-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🔧</span>
          <span className="logo-text">TechPortal</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Rechercher un ticket..." 
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span className="notification-count">{unreadCount} non lues</span>
              </div>
              <div className="notification-list">
                {mockNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="btn-link">Voir toutes</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-container">
          <button 
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar">👨‍🔧</div>
            <span className="profile-name">
              {user?.firstname || 'Technicien'}
            </span>
            <span className="profile-arrow">▼</span>
          </button>
          
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-avatar-large">👨‍🔧</div>
                <div className="profile-details">
                  <div className="profile-name-large">
                    {user?.firstname} {user?.lastname}
                  </div>
                  <div className="profile-role">Technicien</div>
                  <div className="profile-email">{user?.email}</div>
                </div>
              </div>
              <div className="profile-menu">
                <button className="profile-menu-item">
                  ⚙️ Paramètres
                </button>
                <button className="profile-menu-item">
                  📊 Mes statistiques
                </button>
                <button className="profile-menu-item">
                  🎯 Préférences
                </button>
                <hr className="profile-divider" />
                <button className="profile-menu-item logout-btn">
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
