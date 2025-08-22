import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketService, serviceService } from '../services/api';
import TicketCard from '../components/TicketCard';
import CreateTicketModal from '../components/CreateTicketModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      await ticketService.takeTicket(ticketId);
      loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la prise en charge:', error);
    }
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status);
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
        <div className="loading-spinner"></div>
        <p>Chargement de votre tableau de bord...</p>
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
          <div className="dashboard-sections">
            <div className="section">
              <h2>Demandes disponibles ({availableTickets.length})</h2>
              <div className="tickets-list">
                {availableTickets.map(ticket => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onTake={() => handleTicketTaken(ticket.id)}
                    showTakeButton={true}
                  />
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Mes demandes en cours ({getTicketsByStatus('in_progress').length})</h2>
              <div className="tickets-list">
                {getTicketsByStatus('in_progress').map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default Dashboard;
