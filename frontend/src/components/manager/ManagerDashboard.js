import React from 'react';
import { useAuth } from '../../context/AuthContext';

function ManagerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        paddingBottom: '1rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ color: '#333' }}>Dashboard Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Bienvenue, {user?.email}</span>
          <button 
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#e8f4f8', 
        padding: '2rem', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#0056b3', marginBottom: '1rem' }}>
          Interface Manager
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#333' }}>
          Vous êtes connecté en tant que <strong>Manager</strong>
        </p>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          Cette interface permet de gérer les équipes et superviser les interventions.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '0.5rem' }}>Équipes</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>12</p>
            <p style={{ color: '#666' }}>Équipes actives</p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#17a2b8', marginBottom: '0.5rem' }}>Projets</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>24</p>
            <p style={{ color: '#666' }}>Projets en cours</p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#ffc107', marginBottom: '0.5rem' }}>Rapports</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>8</p>
            <p style={{ color: '#666' }}>Rapports mensuels</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
