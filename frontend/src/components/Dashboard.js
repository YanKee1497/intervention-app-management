import React from 'react';
import { useAuth } from '../context/AuthContext';
import './technician/TechnicianDashboard.css';

// Import des différentes interfaces
import TicketsDashboard from '../pages/TicketsDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './manager/ManagerDashboard';

// Import des composants technicien
import TechnicianHeader from './technician/TechnicianHeader';
import StatusCards from './technician/StatusCards';
import TicketsTable from './technician/TicketsTable';
import TechnicianTicketDetailsModal from './technician/TechnicianTicketDetailsModal';

// Interface Employé
function EmployeeDashboard() {
  return <TicketsDashboard />;
}

// Interface Technicien - Version originale avec composants
function TechnicianDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [tickets, setTickets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [notification, setNotification] = React.useState(null);

  // Simulation des données du technicien
  React.useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      const mockTickets = [
        {
          id: 1,
          title: "Problème réseau bureau 205",
          description: "Perte de connexion intermittente dans le bureau 205",
          status: "pending",
          priority: "high",
          category: "Réseau",
          assignedTo: user?.username,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
          location: "Bureau 205",
          reporter: "Marie Dubois",
          estimatedTime: "2 heures"
        },
        {
          id: 2,
          title: "Installation logiciel comptabilité",
          description: "Installation et configuration du nouveau logiciel de comptabilité",
          status: "assigned",
          priority: "medium",
          category: "Logiciel",
          assignedTo: user?.username,
          createdAt: "2024-01-14T14:20:00Z",
          updatedAt: "2024-01-15T09:00:00Z",
          location: "Bureau 102",
          reporter: "Jean Martin",
          estimatedTime: "3 heures"
        },
        {
          id: 3,
          title: "Réparation imprimante HP",
          description: "Bourrage papier récurrent et qualité d'impression dégradée",
          status: "in-progress",
          priority: "low",
          category: "Matériel",
          assignedTo: user?.username,
          createdAt: "2024-01-13T16:45:00Z",
          updatedAt: "2024-01-15T08:15:00Z",
          location: "Open Space RDC",
          reporter: "Sophie Laurent",
          estimatedTime: "1 heure"
        },
        {
          id: 4,
          title: "Problème email Outlook",
          description: "Impossible d'envoyer des emails, erreur SMTP",
          status: "on-hold",
          priority: "medium",
          category: "Email",
          assignedTo: user?.username,
          createdAt: "2024-01-12T11:20:00Z",
          updatedAt: "2024-01-14T16:30:00Z",
          location: "Bureau 301",
          reporter: "Pierre Durand",
          estimatedTime: "1.5 heures"
        },
        {
          id: 5,
          title: "Installation écran supplémentaire",
          description: "Demande d'installation d'un second écran pour le poste de travail",
          status: "resolved",
          priority: "low",
          category: "Matériel",
          assignedTo: user?.username,
          createdAt: "2024-01-10T09:15:00Z",
          updatedAt: "2024-01-11T15:45:00Z",
          location: "Bureau 204",
          reporter: "Anne Moreau",
          estimatedTime: "30 minutes"
        },
        {
          id: 6,
          title: "Problème de connexion VPN",
          description: "Impossible de se connecter au VPN pour le télétravail",
          status: "pending",
          priority: "urgent",
          category: "Réseau",
          assignedTo: user?.username,
          createdAt: "2024-01-15T08:00:00Z",
          updatedAt: "2024-01-15T08:00:00Z",
          location: "Télétravail",
          reporter: "Thomas Bernard",
          estimatedTime: "45 minutes"
        },
        {
          id: 7,
          title: "Mise à jour système Windows",
          description: "Planification et exécution des mises à jour système",
          status: "assigned",
          priority: "medium",
          category: "Système",
          assignedTo: user?.username,
          createdAt: "2024-01-14T12:30:00Z",
          updatedAt: "2024-01-14T12:30:00Z",
          location: "Tous les postes",
          reporter: "Admin Système",
          estimatedTime: "4 heures"
        },
        {
          id: 8,
          title: "Formation utilisateur Excel",
          description: "Formation sur les nouvelles fonctionnalités Excel 365",
          status: "resolved",
          priority: "low",
          category: "Formation",
          assignedTo: user?.username,
          createdAt: "2024-01-09T14:00:00Z",
          updatedAt: "2024-01-10T17:00:00Z",
          location: "Salle de formation",
          reporter: "RH Formation",
          estimatedTime: "2 heures"
        }
      ];
      
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, [user]);

  // Calcul des statistiques basées sur les tickets
  const calculateStats = (ticketsList) => {
    return {
      pending: ticketsList.filter(t => t.status === 'pending').length,
      assigned: ticketsList.filter(t => t.status === 'assigned').length,
      on_hold: ticketsList.filter(t => t.status === 'on-hold').length,
      in_progress: ticketsList.filter(t => t.status === 'in-progress').length,
      resolved: ticketsList.filter(t => t.status === 'resolved').length,
      urgent: ticketsList.filter(t => t.priority === 'urgent').length
    };
  };

  const stats = calculateStats(tickets);

  // Gestion des actions sur les tickets
  const handleTicketAction = (ticketId, action) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          let newStatus = ticket.status;
          switch (action) {
            case 'take':
              newStatus = 'assigned';
              break;
            case 'start':
              newStatus = 'in-progress';
              break;
            case 'hold':
              newStatus = 'on-hold';
              break;
            case 'resolve':
              newStatus = 'resolved';
              break;
            default:
              break;
          }
          return { ...ticket, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return ticket;
      })
    );

    // Afficher une notification
    const actionMessages = {
      take: 'Ticket pris en charge',
      start: 'Intervention démarrée',
      hold: 'Ticket mis en attente',
      resolve: 'Ticket résolu'
    };
    
    setNotification({
      type: 'success',
      message: actionMessages[action] || 'Action effectuée'
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion...');
  };

  return (
    <div className="technician-dashboard">
      {/* Header avec navigation */}
      <TechnicianHeader
        user={user}
        notifications={3}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      {/* Contenu principal */}
      <main className="main-content">
        <div className="content-container">
          {/* En-tête de bienvenue */}
          <div className="page-header">
            <div className="breadcrumb">
              <span>Accueil</span> &gt; <span>Dashboard Technicien</span>
            </div>
            <div className="page-header-content">
              <h1 className="page-title">Interface Technicien</h1>
              {searchQuery && (
                <div className="search-indicator">
                  <span>🔍 Recherche: "{searchQuery}"</span>
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p style={{ color: '#6b7280', fontSize: '16px', margin: '8px 0 0 0' }}>
              Bienvenue {user?.firstname || user?.username} - Gérez vos interventions techniques
            </p>
          </div>

          {/* Cartes de statut pour filtrage */}
          <StatusCards
            stats={stats}
            selectedStatus={statusFilter}
            onStatusChange={handleStatusFilter}
          />

          {/* Tableau des tickets */}
          <TicketsTable
            tickets={tickets}
            selectedStatus={statusFilter}
            onTicketSelect={handleTicketDetails}
            onTicketAction={handleTicketAction}
            isLoading={loading}
            user={user}
            currentUser={user}
          />
        </div>
      </main>

      {/* Modal de détails du ticket */}
      {selectedTicket && (
        <TechnicianTicketDetailsModal
          ticket={selectedTicket}
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={handleTicketAction}
        />
      )}

      {/* Notifications système */}
      {notification && (
        <div className={`system-alert alert-${notification.type}`}>
          <span className="alert-message">{notification.message}</span>
          <button 
            className="alert-close-btn"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}
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