import React, { useState } from 'react';
import './TechnicianHeader.css';

const TechnicianHeader = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="technician-header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">GT</div>
            <span className="logo-text">GT System</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input 
              type="text" 
              placeholder="chercher tickets, utilisateurs, ID..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          <div className="notification-container">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">2</span>
            </button>
          </div>
          
          <div className="language-selector">
            <span>FR</span>
          </div>

          <div className="user-profile">
            <div className="user-info">
              <div className="user-name">{user?.firstname} {user?.lastname}</div>
              <div className="user-role">technicien</div>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TechnicianHeader;
