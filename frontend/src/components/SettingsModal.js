import React, { useState } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    // Préférences générales
    theme: 'light', // light, dark, auto
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'dd/mm/yyyy',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    notifyOnAssignment: true,
    notifyOnStatusChange: true,
    notifyOnComment: true,
    notifyOnMaintenance: false,
    
    // Interface
    compactMode: false,
    showSidebar: true,
    autoRefresh: true,
    refreshInterval: '30', // en secondes
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: '30', // en minutes
    
    // Données
    autoSave: true,
    backupFrequency: 'daily'
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Ici, on sauvegarderait les paramètres
    console.log('Sauvegarde des paramètres:', settings);
    setHasUnsavedChanges(false);
    alert('Paramètres sauvegardés avec succès !');
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?')) {
      setSettings({
        theme: 'light',
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'dd/mm/yyyy',
        emailNotifications: true,
        pushNotifications: true,
        soundNotifications: false,
        notifyOnAssignment: true,
        notifyOnStatusChange: true,
        notifyOnComment: true,
        notifyOnMaintenance: false,
        compactMode: false,
        showSidebar: true,
        autoRefresh: true,
        refreshInterval: '30',
        twoFactorAuth: false,
        sessionTimeout: '30',
        autoSave: true,
        backupFrequency: 'daily'
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment fermer ?')) {
        onClose();
        setHasUnsavedChanges(false);
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="settings-modal-overlay" onClick={handleClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-modal-header">
          <div className="settings-modal-title">
            <h2>⚙️ Paramètres</h2>
            {hasUnsavedChanges && (
              <span className="unsaved-indicator">●</span>
            )}
          </div>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="settings-modal-body">
          
          {/* Section Apparence */}
          <div className="settings-section">
            <h3>🎨 Apparence</h3>
            
            <div className="setting-group">
              <label className="setting-label">Thème</label>
              <div className="setting-control">
                <select 
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="setting-select"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Langue</label>
              <div className="setting-control">
                <select 
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="setting-select"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Format de date</label>
              <div className="setting-control">
                <select 
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="setting-select"
                >
                  <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
                  <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
                  <option value="yyyy-mm-dd">AAAA-MM-JJ</option>
                </select>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Mode compact
                </label>
                <p className="setting-description">Affichage plus dense pour optimiser l'espace</p>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.showSidebar}
                    onChange={(e) => handleSettingChange('showSidebar', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Afficher la barre latérale
                </label>
              </div>
            </div>
          </div>

          {/* Section Notifications */}
          <div className="settings-section">
            <h3>🔔 Notifications</h3>
            
            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Notifications par email
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Notifications push
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.soundNotifications}
                    onChange={(e) => handleSettingChange('soundNotifications', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Notifications sonores
                </label>
              </div>
            </div>

            <h4 className="subsection-title">Types de notifications</h4>
            
            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnAssignment}
                    onChange={(e) => handleSettingChange('notifyOnAssignment', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Attribution de ticket
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnStatusChange}
                    onChange={(e) => handleSettingChange('notifyOnStatusChange', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Changement de statut
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnComment}
                    onChange={(e) => handleSettingChange('notifyOnComment', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Nouveaux commentaires
                </label>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnMaintenance}
                    onChange={(e) => handleSettingChange('notifyOnMaintenance', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Maintenances programmées
                </label>
              </div>
            </div>
          </div>

          {/* Section Comportement */}
          <div className="settings-section">
            <h3>⚡ Comportement</h3>
            
            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Actualisation automatique
                </label>
              </div>
            </div>

            {settings.autoRefresh && (
              <div className="setting-group">
                <label className="setting-label">Intervalle d'actualisation</label>
                <div className="setting-control">
                  <select 
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingChange('refreshInterval', e.target.value)}
                    className="setting-select"
                  >
                    <option value="15">15 secondes</option>
                    <option value="30">30 secondes</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
              </div>
            )}

            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Sauvegarde automatique
                </label>
              </div>
            </div>
          </div>

          {/* Section Sécurité */}
          <div className="settings-section">
            <h3>🔐 Sécurité</h3>
            
            <div className="setting-group">
              <div className="setting-control">
                <label className="setting-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Authentification à deux facteurs
                </label>
                <p className="setting-description">Ajoute une couche de sécurité supplémentaire</p>
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Délai d'expiration de session</label>
              <div className="setting-control">
                <select 
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  className="setting-select"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="240">4 heures</option>
                  <option value="480">8 heures</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Données */}
          <div className="settings-section">
            <h3>💾 Données</h3>
            
            <div className="setting-group">
              <label className="setting-label">Fréquence de sauvegarde</label>
              <div className="setting-control">
                <select 
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  className="setting-select"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
            </div>

            <div className="setting-group">
              <div className="danger-zone">
                <h4>⚠️ Zone dangereuse</h4>
                <button className="btn-danger" onClick={handleReset}>
                  🔄 Restaurer les paramètres par défaut
                </button>
                <p className="setting-description">Cette action ne peut pas être annulée</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-modal-footer">
          <div className="footer-actions">
            <button className="btn-cancel" onClick={handleClose}>
              Annuler
            </button>
            <button 
              className={`btn-save ${hasUnsavedChanges ? 'has-changes' : ''}`}
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
