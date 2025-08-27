import React from 'react';

function HeaderSimple({ user, notifications = 0, onLogout }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ color: '#667eea', margin: 0 }}>GT System</h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ 
          position: 'relative',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '10px',
          padding: '8px 12px',
          fontSize: '14px',
          color: '#667eea'
        }}>
          🔔 {notifications}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {user?.name ? user.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : 'U'}
          </div>
          
          <span style={{ color: '#333', fontSize: '14px' }}>{user?.name || 'Utilisateur'}</span>
          
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(220, 53, 69, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderSimple;
