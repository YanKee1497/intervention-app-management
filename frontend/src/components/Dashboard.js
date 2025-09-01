import React from 'react';
import { useAuth } from '../context/AuthContext';
import './employee-dashboard.css';

// Import des différentes interfaces
import TechnicianDashboard from './technician/TechnicianDashboard';
import AdminDashboard from './admin/AdminDashboard';

// Interface Employé
function EmployeeDashboard() {
  return (
    <div className="employee-dashboard">
      <h1>Dashboard Employé</h1>
      <p>Interface employé en cours de développement...</p>
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