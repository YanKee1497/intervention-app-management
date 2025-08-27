import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketService, serviceService } from '../services/api';
import TicketCard from '../components/TicketCard';
import CreateTicketModal from '../components/CreateTicketModal';
import Toast from '../components/Toast';
import TechnicianHeader from '../components/TechnicianHeader';
import StatusCards from '../components/StatusCards';
import TicketsTable from '../components/TicketsTable';
import TechnicianTicketDetailsModal from '../components/TechnicianTicketDetailsModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [filteredAvailableTickets, setFilteredAvailableTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });
  const [statsAnimation, setStatsAnimation] = useState(false);
  
  // États pour la nouvelle interface technicien
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'kanban'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les services
      const servicesData = await serviceService.getServices();
      setServices(servicesData);

      // Charger les tickets selon le rôle
      if (user.role === 'technician') {
        const [userTickets, availableTicketsData] = await Promise.all([
          ticketService.getTickets(),
          ticketService.getAvailableTickets()
        ]);
        setTickets(userTickets);
        setAvailableTickets(availableTicketsData);
        setFilteredAvailableTickets(availableTicketsData);
      } else {
        const ticketsData = await ticketService.getTickets();
        setTickets(ticketsData);
      }

      // Charger les stats pour managers et admins
      if (['manager', 'admin'].includes(user.role)) {
        const statsData = await ticketService.getStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketCreated = () => {
    setShowCreateModal(false);
    loadDashboardData();
  };

  const handleTicketTaken = async (ticketId) => {
    try {
      setStatsAnimation(true);
      await ticketService.takeTicket(ticketId);
      loadDashboardData();
      showToast('🚀 Ticket pris en charge avec succès !', 'success');
      setTimeout(() => setStatsAnimation(false), 1000);
    } catch (error) {
      console.error('Erreur lors de la prise en charge:', error);
      showToast('❌ Erreur lors de la prise en charge du ticket', 'error');
      setStatsAnimation(false);
    }
  };

  const handleTicketCompleted = async (ticketId) => {
    try {
      // Confirmer avant de marquer comme terminé
      if (window.confirm('Êtes-vous sûr de vouloir marquer ce ticket comme terminé ?')) {
        setStatsAnimation(true);
        await ticketService.updateTicketStatus(ticketId, 'resolved');
        loadDashboardData();
        showToast('✅ Ticket marqué comme terminé !', 'success');
        setTimeout(() => setStatsAnimation(false), 1000);
      }
    } catch (error) {
      console.error('Erreur lors de la complétion:', error);
      showToast('❌ Erreur lors de la mise à jour du ticket', 'error');
      setStatsAnimation(false);
    }
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    let filtered = [...availableTickets];
    
    switch (filter) {
      case 'urgent':
        filtered = availableTickets.filter(ticket => 
          ticket.urgency === 'high' || ticket.urgency === 'critical'
        );
        break;
      case 'critical':
        filtered = availableTickets.filter(ticket => ticket.urgency === 'critical');
        break;
      case 'informatique':
        filtered = availableTickets.filter(ticket => 
          ticket.service_name && ticket.service_name.toLowerCase().includes('informatique')
        );
        break;
      case 'maintenance':
        filtered = availableTickets.filter(ticket => 
          ticket.service_name && ticket.service_name.toLowerCase().includes('maintenance')
        );
        break;
      default:
        filtered = availableTickets;
    }
    
    setFilteredAvailableTickets(filtered);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Gestionnaires pour la nouvelle interface technicien
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleStatusFilter = (status) => {
    setActiveFilter(status);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleTicketStatusUpdate = async (ticketId, newStatus) => {
    try {
      await ticketService.updateTicketStatus(ticketId, newStatus);
      loadDashboardData();
      showToast(`Ticket mis à jour: ${newStatus}`, 'success');
    } catch (error) {
      console.error('Erreur mise à jour ticket:', error);
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  // Gestionnaire d'actions des tickets pour le tableau
  const handleTicketAction = async (action, ticketId) => {
    const ticket = [...tickets, ...availableTickets].find(t => t.id === ticketId);
    
    switch (action) {
      case 'take':
        await handleTicketTaken(ticketId);
        break;
      case 'start':
        // Commencer le travail sur un ticket assigné
        try {
          await ticketService.updateTicketStatus(ticketId, 'in_progress');
          loadDashboardData();
          showToast('🚀 Travail commencé sur le ticket !', 'success');
        } catch (error) {
          console.error('Erreur lors du démarrage:', error);
          showToast('❌ Erreur lors du démarrage du travail', 'error');
        }
        break;
      case 'updateStatus':
        // Pour l'instant, on ouvre les détails pour changer le statut
        setSelectedTicket(ticket);
        setShowTicketDetails(true);
        break;
      case 'addComment':
        setSelectedTicket(ticket);
        setShowTicketDetails(true);
        break;
      case 'details':
        setSelectedTicket(ticket);
        setShowTicketDetails(true);
        break;
      default:
        break;
    }
  };

  // Données pour les nouvelles cartes de statut
  const getTicketStats = () => {
    const allTickets = [...tickets, ...availableTickets];
    return {
      unassigned: allTickets.filter(t => t.status === 'pending').length,
      assigned: allTickets.filter(t => t.status === 'assigned').length,
      on_hold: allTickets.filter(t => t.status === 'on_hold').length,
      in_progress: allTickets.filter(t => t.status === 'in_progress').length,
      resolved: allTickets.filter(t => t.status === 'resolved').length
    };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      employee: 'Employé',
      technician: 'Technicien',
      manager: 'Manager',
      admin: 'Administrateur'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="technician-loading-container">
          <div className="loading-animation">
            <div className="loading-gear">🔧</div>
            <div className="loading-text">
              <h3>Chargement de votre interface technicien...</h3>
              <p>Récupération des demandes d'intervention</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {user.firstname}!</h1>
          <p className="user-role">{getRoleDisplayName(user.role)}</p>
        </div>

        {user.role === 'employee' && (
          <button 
            className="create-ticket-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Nouvelle demande
          </button>
        )}
      </div>

      {/* Statistiques pour managers et admins */}
      {stats && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.pending || 0}</div>
              <div className="stat-label">En attente</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.in_progress || 0}</div>
              <div className="stat-label">En cours</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.resolved || 0}</div>
              <div className="stat-label">Résolues</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {stats.avg_resolution_time_hours ? 
                  Math.round(stats.avg_resolution_time_hours) + 'h' : 'N/A'}
              </div>
              <div className="stat-label">Temps moyen</div>
            </div>
          </div>
        </div>
      )}

      {/* Interface employé */}
      {user.role === 'employee' && (
        <div className="employee-dashboard">
          <div className="tickets-section">
            <h2>Mes demandes</h2>
            
            <div className="tickets-categories">
              <div className="ticket-category">
                <h3>En attente d'affectation ({getTicketsByStatus('pending').length})</h3>
                <div className="tickets-list">
                  {getTicketsByStatus('pending').map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>

              <div className="ticket-category">
                <h3>En cours ({getTicketsByStatus('assigned').length + getTicketsByStatus('in_progress').length})</h3>
                <div className="tickets-list">
                  {[...getTicketsByStatus('assigned'), ...getTicketsByStatus('in_progress')].map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>

              <div className="ticket-category">
                <h3>Résolues ({getTicketsByStatus('resolved').length})</h3>
                <div className="tickets-list">
                  {getTicketsByStatus('resolved').map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interface technicien */}
      {user.role === 'technician' && (
        <div className="technician-dashboard">
          {/* Nouveau header technicien */}
          <TechnicianHeader 
            onSearch={handleSearch}
            onNotificationClick={() => showToast('Notifications développées bientôt!', 'info')}
            technicianName={user.firstname}
          />

          {/* Nouvelles cartes de statut */}
          <StatusCards 
            stats={getTicketStats()}
            onCardClick={handleStatusFilter}
            activeFilter={activeFilter}
          />

          {/* Nouveau tableau des tickets */}
          <TicketsTable 
            tickets={[...tickets, ...availableTickets]}
            onTicketAction={handleTicketAction}
            onTicketClick={handleTicketClick}
            currentUser={user}
            filteredStatus={activeFilter}
            searchTerm={searchTerm}
          />

          {/* Modal de détails du ticket */}
          {showTicketDetails && selectedTicket && (
            <TechnicianTicketDetailsModal
              ticket={selectedTicket}
              onClose={() => {
                setShowTicketDetails(false);
                setSelectedTicket(null);
              }}
              onStatusChange={handleTicketStatusUpdate}
              onUpdate={loadDashboardData}
            />
          )}
        </div>
      )}

      {/* Interface manager/admin */}
      {['manager', 'admin'].includes(user.role) && (
        <div className="manager-dashboard">
          <div className="dashboard-sections">
            <div className="section">
              <h2>Toutes les demandes ({tickets.length})</h2>
              <div className="tickets-list">
                {tickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} showAssignButton={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de ticket */}
      {showCreateModal && (
        <CreateTicketModal
          services={services}
          onClose={() => setShowCreateModal(false)}
          onTicketCreated={handleTicketCreated}
        />
      )}

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Dashboard;
