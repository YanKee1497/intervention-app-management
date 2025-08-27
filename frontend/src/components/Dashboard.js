import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import des différentes interfaces
import TicketsDashboard from '../pages/TicketsDashboard';

// Import des composants technicien que nous avons créés
import TechnicianHeader from './technician/TechnicianHeader';
import StatusCards from './technician/StatusCards';
import TicketsTable from './technician/TicketsTable';
import TechnicianTicketDetailsModal from './technician/TechnicianTicketDetailsModal';

// CSS pour l'interface technicien
import './technician/TechnicianHeader.css';
import './technician/StatusCards.css';
import './technician/TicketsTable.css';
import './technician/TechnicianTicketDetailsModal.css';

// Interface Technicien
function TechnicianDashboard() {
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [tickets, setTickets] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useAuth();

  // Simulation de chargement des tickets depuis l'API
  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        
        // Simulation d'appel API - en attendant, utilisons des données locales
        const mockTickets = [
          {
            id: 1,
            ticket_number: 'TCK-001',
            title: 'Installation logiciel antivirus - URGENT',
            description: 'Installation et configuration du logiciel antivirus sur le poste de travail principal.',
            urgency: 'high',
            status: 'pending',
            service: { name: 'Informatique' },
            employee: { firstname: 'Marie', lastname: 'Dupont' },
            technician: null,
            created_at: '2024-03-15T10:30:00Z',
            updated_at: '2024-03-15T10:30:00Z'
          },
          {
            id: 2,
            ticket_number: 'TCK-002',
            title: 'Réparation imprimante réseau',
            description: 'L\'imprimante du service comptabilité ne répond plus aux demandes d\'impression.',
            urgency: 'medium',
            status: 'assigned',
            service: { name: 'Maintenance' },
            employee: { firstname: 'Pierre', lastname: 'Martin' },
            technician: { firstname: 'Jean', lastname: 'Technicien' },
            created_at: '2024-03-14T14:20:00Z',
            updated_at: '2024-03-15T09:15:00Z'
          },
          {
            id: 3,
            ticket_number: 'TCK-003',
            title: 'Configuration accès VPN',
            description: 'Mise en place d\'un accès VPN pour le télétravail.',
            urgency: 'medium',
            status: 'on_hold',
            service: { name: 'Informatique' },
            employee: { firstname: 'Sophie', lastname: 'Chen' },
            technician: { firstname: 'Jean', lastname: 'Technicien' },
            created_at: '2024-03-13T16:45:00Z',
            updated_at: '2024-03-14T11:30:00Z'
          },
          {
            id: 4,
            ticket_number: 'TCK-004',
            title: 'Mise à jour système Windows',
            description: 'Mise à jour de sécurité critique sur tous les postes.',
            urgency: 'high',
            status: 'in_progress',
            service: { name: 'Informatique' },
            employee: { firstname: 'Alex', lastname: 'Bernard' },
            technician: { firstname: 'Marie', lastname: 'Technicien2' },
            created_at: '2024-03-12T08:15:00Z',
            updated_at: '2024-03-15T13:20:00Z'
          },
          {
            id: 5,
            ticket_number: 'TCK-005',
            title: 'Formation bureautique',
            description: 'Formation sur les nouvelles fonctionnalités d\'Office 365.',
            urgency: 'low',
            status: 'resolved',
            service: { name: 'Formation' },
            employee: { firstname: 'Claire', lastname: 'Dubois' },
            technician: { firstname: 'Jean', lastname: 'Technicien' },
            created_at: '2024-03-10T14:30:00Z',
            updated_at: '2024-03-12T16:45:00Z'
          },
          {
            id: 6,
            ticket_number: 'TCK-006',
            title: 'Récupération données supprimées',
            description: 'Récupération de fichiers importants supprimés par erreur.',
            urgency: 'high',
            status: 'pending',
            service: { name: 'Informatique' },
            employee: { firstname: 'Thomas', lastname: 'Rousseau' },
            technician: null,
            created_at: '2024-03-16T09:00:00Z',
            updated_at: '2024-03-16T09:00:00Z'
          },
          {
            id: 7,
            ticket_number: 'TCK-007',
            title: 'Problème connexion Wi-Fi',
            description: 'Connexion Wi-Fi instable dans la salle de réunion.',
            urgency: 'medium',
            status: 'assigned',
            service: { name: 'Informatique' },
            employee: { firstname: 'Emma', lastname: 'Leroy' },
            technician: { firstname: 'Marie', lastname: 'Technicien2' },
            created_at: '2024-03-11T11:15:00Z',
            updated_at: '2024-03-12T08:30:00Z'
          },
          {
            id: 8,
            ticket_number: 'TCK-008',
            title: 'Installation nouveau logiciel métier',
            description: 'Installation et formation sur le nouveau logiciel de gestion.',
            urgency: 'medium',
            status: 'on_hold',
            service: { name: 'Formation' },
            employee: { firstname: 'Lucas', lastname: 'Moreau' },
            technician: { firstname: 'Jean', lastname: 'Technicien' },
            created_at: '2024-03-09T15:20:00Z',
            updated_at: '2024-03-11T10:10:00Z'
          }
        ];

        setTickets(mockTickets);
      } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Gestion des actions sur les tickets
  const handleTicketAction = async (ticketId, action, data = {}) => {
    try {
      let updatedTickets = [...tickets];
      const ticketIndex = updatedTickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) return;

      switch (action) {
        case 'take':
          updatedTickets[ticketIndex] = {
            ...updatedTickets[ticketIndex],
            status: 'assigned',
            technician: user,
            updated_at: new Date().toISOString()
          };
          break;
          
        case 'start':
          updatedTickets[ticketIndex] = {
            ...updatedTickets[ticketIndex],
            status: 'in_progress',
            updated_at: new Date().toISOString()
          };
          break;
          
        case 'hold':
          updatedTickets[ticketIndex] = {
            ...updatedTickets[ticketIndex],
            status: 'on_hold',
            updated_at: new Date().toISOString()
          };
          break;
          
        case 'resolve':
          updatedTickets[ticketIndex] = {
            ...updatedTickets[ticketIndex],
            status: 'resolved',
            resolved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          break;
          
        case 'update_status':
          updatedTickets[ticketIndex] = {
            ...updatedTickets[ticketIndex],
            status: data.status,
            updated_at: new Date().toISOString()
          };
          break;
          
        default:
          console.warn('Action non reconnue:', action);
          return;
      }

      setTickets(updatedTickets);
      console.log(`Action ${action} effectuée sur le ticket ${ticketId}`);
      
    } catch (error) {
      console.error('Erreur lors de l\'action sur le ticket:', error);
    }
  };

  // Calcul des statistiques
  const getTicketStats = () => {
    return {
      pending: tickets.filter(t => t.status === 'pending').length,
      assigned: tickets.filter(t => t.status === 'assigned').length,
      on_hold: tickets.filter(t => t.status === 'on_hold').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length
    };
  };

  const stats = getTicketStats();

  return (
    <div className="technician-dashboard">
      <TechnicianHeader user={user} />
      
      <main className="main-content">
        <div className="content-container">
          
          <StatusCards 
            stats={stats}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
          
          <TicketsTable 
            tickets={tickets}
            selectedStatus={selectedStatus}
            onTicketSelect={setSelectedTicket}
            onTicketAction={handleTicketAction}
            isLoading={isLoading}
            user={user}
          />
          
          {selectedTicket && (
            <TechnicianTicketDetailsModal
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
              onTicketAction={handleTicketAction}
              user={user}
            />
          )}
          
        </div>
      </main>
    </div>
  );
}

// Interface Admin (peut être développée plus tard)
function AdminDashboard() {
  return (
    <div>
      <h1>Interface Administrateur</h1>
      <p>Interface d'administration en cours de développement...</p>
    </div>
  );
}

// Interface Manager (peut être développée plus tard) 
function ManagerDashboard() {
  return (
    <div>
      <h1>Interface Manager</h1>
      <p>Interface de gestion en cours de développement...</p>
    </div>
  );
}

// Composant principal de routage par rôle
function Dashboard() {
  const { user } = useAuth();

  console.log('🔍 Dashboard - utilisateur connecté:', user);

  if (!user) {
    return <div>Chargement...</div>;
  }

  // Routage selon le rôle de l'utilisateur
  switch (user.role) {
    case 'technician':
      console.log('📋 Affichage interface technicien');
      return <TechnicianDashboard />;
      
    case 'admin':
      console.log('👑 Affichage interface admin');
      return <AdminDashboard />;
      
    case 'manager':
      console.log('📊 Affichage interface manager');
      return <ManagerDashboard />;
      
    case 'employee':
    default:
      console.log('👤 Affichage interface employé');
      return <TicketsDashboard />;
  }
}

export default Dashboard;
