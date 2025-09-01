import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import TicketManagement from './TicketManagement';
import SystemSettings from './SystemSettings';
import Reports from './Reports';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Charger les notifications admin
    loadAdminNotifications();
  }, []);

  const loadAdminNotifications = () => {
    // Simulation de notifications admin
    setNotifications([
      {
        id: 1,
        type: 'urgent',
        title: 'Nouvelle demande d\'accès système',
        message: '3 techniciens en attente d\'approbation',
        time: '2 min',
        unread: true
      },
      {
        id: 2,
        type: 'warning',
        title: 'Pic d\'activité détecté',
        message: '15 tickets créés dans la dernière heure',
        time: '15 min',
        unread: true
      },
      {
        id: 3,
        type: 'info',
        title: 'Maintenance programmée',
        message: 'Sauvegarde automatique à 23h00',
        time: '1h',
        unread: false
      }
    ]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'tickets':
        return <TicketManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'reports':
        return <Reports />;
      default:
        return <AdminOverview />;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <div className="unauthorized-content">
          <h2>Accès non autorisé</h2>
          <p>Vous devez être administrateur pour accéder à cette interface.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader 
        user={user}
        notifications={notifications}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="admin-main">
        <AdminSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
        />
        
        <main className="admin-content">
          <div className="admin-content-wrapper">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
