import React, { useState } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'fr',
    notifications: {
      email: true,
      push: true,
      ticketUpdates: true,
      newAssignments: true,
      reminders: true
    },
    dashboard: {
      defaultView: 'kanban',
      itemsPerPage: 20,
      autoRefresh: true,
      refreshInterval: 30
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60,
      passwordExpiry: 90
    }
  });

  if (!isOpen) return null;

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    console.log('Paramètres sauvegardés:', settings);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-cog"></i>
            Paramètres
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="settings-content">
          {/* Section Apparence */}
          <div className="settings-section">
            <h3>
              <i className="fas fa-palette"></i>
              Apparence
            </h3>
            <div className="setting-item">
              <label>Thème</label>
              <select 
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Langue</label>
              <select 
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Section Notifications */}
          <div className="settings-section">
            <h3>
              <i className="fas fa-bell"></i>
              Notifications
            </h3>
            <div className="toggle-group">
              <div className="toggle-item">
                <label>Notifications par email</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                  <span className="slider"></span>
                </div>
              </div>
              <div className="toggle-item">
                <label>Notifications push</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                  <span className="slider"></span>
                </div>
              </div>
              <div className="toggle-item">
                <label>Mises à jour des tickets</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.ticketUpdates}
                    onChange={(e) => handleSettingChange('notifications', 'ticketUpdates', e.target.checked)}
                  />
                  <span className="slider"></span>
                </div>
              </div>
              <div className="toggle-item">
                <label>Nouvelles assignations</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.newAssignments}
                    onChange={(e) => handleSettingChange('notifications', 'newAssignments', e.target.checked)}
                  />
                  <span className="slider"></span>
                </div>
              </div>
              <div className="toggle-item">
                <label>Rappels</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.reminders}
                    onChange={(e) => handleSettingChange('notifications', 'reminders', e.target.checked)}
                  />
                  <span className="slider"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Tableau de bord */}
          <div className="settings-section">
            <h3>
              <i className="fas fa-tachometer-alt"></i>
              Tableau de bord
            </h3>
            <div className="setting-item">
              <label>Vue par défaut</label>
              <select 
                value={settings.dashboard.defaultView}
                onChange={(e) => handleSettingChange('dashboard', 'defaultView', e.target.value)}
              >
                <option value="table">Tableau</option>
                <option value="kanban">Kanban</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Éléments par page</label>
              <select 
                value={settings.dashboard.itemsPerPage}
                onChange={(e) => handleSettingChange('dashboard', 'itemsPerPage', parseInt(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="toggle-item">
              <label>Actualisation automatique</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.dashboard.autoRefresh}
                  onChange={(e) => handleSettingChange('dashboard', 'autoRefresh', e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </div>
            {settings.dashboard.autoRefresh && (
              <div className="setting-item">
                <label>Intervalle d'actualisation (secondes)</label>
                <select 
                  value={settings.dashboard.refreshInterval}
                  onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="120">120</option>
                </select>
              </div>
            )}
          </div>

          {/* Section Sécurité */}
          <div className="settings-section">
            <h3>
              <i className="fas fa-shield-alt"></i>
              Sécurité
            </h3>
            <div className="toggle-item">
              <label>Authentification à deux facteurs</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.security.twoFactor}
                  onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </div>
            <div className="setting-item">
              <label>Délai d'expiration de session (minutes)</label>
              <select 
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              >
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="120">120</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Expiration du mot de passe (jours)</label>
              <select 
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
              >
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="180">180</option>
                <option value="365">365</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
