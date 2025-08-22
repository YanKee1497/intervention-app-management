import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    return `${user.firstname?.charAt(0) || ''}${user.lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      employee: 'Employé',
      technician: 'Technicien',
      manager: 'Manager',
      admin: 'Administrateur'
    };
    return roleNames[role] || role;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="logo">
            <h2>InterventionApp</h2>
          </div>
        </div>

        <div className="navbar-center">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Rechercher un ticket..."
              className="search-input"
            />
          </div>
        </div>

        <div className="navbar-right">
          <div className="notifications">
            <button className="notification-btn">
              🔔
              <span className="notification-count">3</span>
            </button>
          </div>

          <div className="user-menu">
            <div className="user-avatar">
              {getInitials()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.firstname} {user.lastname}</span>
              <span className="user-role">{getRoleDisplayName(user.role)}</span>
            </div>
            <div className="user-actions">
              <button className="logout-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
