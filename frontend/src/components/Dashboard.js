import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import des différentes interfaces
import TicketsDashboard from '../pages/TicketsDashboard';
import AdminDashboard from './admin/AdminDashboard';

// Interface Employé
function EmployeeDashboard() {
  return <TicketsDashboard />;
}

// Interface Technicien - Version inline pour éviter les problèmes d'import
function TechnicianDashboard() {
  const { user } = useAuth();
  
  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
        Dashboard Technicien
      </h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '1rem' }}>
        Bienvenue {user?.username} !
      </p>
      <p style={{ fontSize: '1rem', opacity: 0.8 }}>
        Interface technicien (version inline)
      </p>
    </div>
  );
}

// Interface Gestionnaire
function ManagerDashboard() {
  return (
    <div className="manager-dashboard">
      <h1>Dashboard Gestionnaire</h1>
      <p>Interface de gestion en cours de développement...</p>
    </div>
  );
}

// Composant principal Dashboard
function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="dashboard-loading">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Sélection de l'interface selon le rôle de l'utilisateur
  switch (user.role) {
    case 'technician':
      return <TechnicianDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return (
        <div className="dashboard-error">
          <h1>Erreur</h1>
          <p>Rôle utilisateur non reconnu: {user.role}</p>
        </div>
      );
  }
}

export default Dashboard;