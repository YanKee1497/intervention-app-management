import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';

const TestModals = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const testUser = {
    firstname: 'Jean',
    lastname: 'Dupont',
    email: 'jean.dupont@entreprise.com',
    department: 'Support technique'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test des Modales</h2>
      <button onClick={() => setShowProfile(true)} style={{ margin: '10px', padding: '10px' }}>
        Tester Modal Profil
      </button>
      <button onClick={() => setShowSettings(true)} style={{ margin: '10px', padding: '10px' }}>
        Tester Modal Paramètres
      </button>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={testUser}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default TestModals;
