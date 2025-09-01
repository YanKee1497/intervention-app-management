import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab, onTabChange, collapsed }) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: 'fas fa-tachometer-alt',
      description: 'Tableau de bord principal'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: 'fas fa-users',
      description: 'Gestion des comptes utilisateurs'
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: 'fas fa-ticket-alt',
      description: 'Administration des tickets'
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: 'fas fa-chart-bar',
      description: 'Statistiques et analyses'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: 'fas fa-cog',
      description: 'Configuration du système'
    }
  ];

  const systemItems = [
    {
      id: 'logs',
      label: 'Journaux',
      icon: 'fas fa-file-alt',
      description: 'Logs système et audit'
    },
    {
      id: 'backup',
      label: 'Sauvegarde',
      icon: 'fas fa-database',
      description: 'Gestion des sauvegardes'
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: 'fas fa-tools',
      description: 'Outils de maintenance'
    }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">
            <i className="fas fa-home"></i>
            {!collapsed && <span>Principal</span>}
          </h3>
          
          <ul className="nav-menu">
            {menuItems.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                  title={collapsed ? item.label : ''}
                >
                  <i className={item.icon}></i>
                  {!collapsed && (
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                  {!collapsed && (
                    <div className="nav-indicator">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">
            <i className="fas fa-server"></i>
            {!collapsed && <span>Système</span>}
          </h3>
          
          <ul className="nav-menu">
            {systemItems.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                  title={collapsed ? item.label : ''}
                >
                  <i className={item.icon}></i>
                  {!collapsed && (
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                  {!collapsed && (
                    <div className="nav-indicator">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="system-status">
            <h4>État du système</h4>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Serveur en ligne</span>
            </div>
            <div className="status-item">
              <span className="status-indicator good"></span>
              <span>Performance optimale</span>
            </div>
            <div className="status-item">
              <span className="status-indicator warning"></span>
              <span>Maintenance prévue 23h</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
