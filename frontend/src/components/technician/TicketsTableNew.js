import React, { useState } from 'react';
import './TicketsTable.css';

const TicketsTable = ({ 
  tickets, 
  selectedStatus, 
  onTicketSelect, 
  onTicketAction, 
  isLoading, 
  user, 
  onNewTicket, 
  currentUser 
}) => {
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [draggedTicket, setDraggedTicket] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  if (!user || !user.id) {
    return (
      <div className="tickets-table-loading">
        <div className="loading-message">
          <p>Chargement du profil utilisateur...</p>
        </div>
      </div>
    );
  }

  if (!tickets || !Array.isArray(tickets)) {
    return (
      <div className="tickets-table-loading">
        <div className="loading-message">
          <p>Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  const filteredTickets = tickets.filter(ticket => {
    if (!ticket || !ticket.id) return false;
    if (selectedStatus === 'all') return true;
    return ticket.status === selectedStatus;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Non pris en charge', class: 'status-pending', icon: '🔴' },
      assigned: { label: 'Assigné', class: 'status-assigned', icon: '🟣' },
      in_progress: { label: 'En cours', class: 'status-in-progress', icon: '🟡' },
      on_hold: { label: 'En attente', class: 'status-on-hold', icon: '🟠' },
      resolved: { label: 'Résolu', class: 'status-resolved', icon: '🟢' }
    };

    const config = statusConfig[status] || { label: status, class: 'status-unknown', icon: '❓' };
    
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: 'Faible', class: 'priority-low', icon: '🟢' },
      medium: { label: 'Moyenne', class: 'priority-medium', icon: '🟡' },
      high: { label: 'Haute', class: 'priority-high', icon: '🟠' },
      critical: { label: 'Critique', class: 'priority-critical', icon: '🔴' }
    };

    const config = priorityConfig[priority] || { label: priority, class: 'priority-unknown', icon: '❓' };
    
    return (
      <span className={`priority-badge ${config.class}`}>
        <span className="priority-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const canTakeTicket = (ticket) => {
    if (!ticket || !user) return false;
    return ticket.status === 'pending' || (ticket.status === 'assigned' && !ticket.technician_id);
  };

  const canStartWork = (ticket) => {
    if (!ticket || !user) return false;
    return ticket.status === 'assigned' && ticket.technician_id === user.id;
  };

  if (isLoading) {
    return (
      <div className="tickets-table-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-table-container">
      <div className="table-header">
        <div className="table-title">
          <h3>
            {selectedStatus === 'all' ? 'Tous les tickets' : 
             `Tickets ${getStatusBadge(selectedStatus).props.children[1]}`}
          </h3>
          <span className="tickets-count">({sortedTickets.length})</span>
        </div>
        
        <div className="table-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Tableau
            </button>
          </div>
          
          <select 
            className="sort-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="created_at-desc">Plus récents</option>
            <option value="created_at-asc">Plus anciens</option>
            <option value="urgency-desc">Priorité haute</option>
            <option value="urgency-asc">Priorité basse</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Titre</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Service</th>
              <th>Employé</th>
              <th>Technicien</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map(ticket => (
              <tr key={ticket.id} className="ticket-row">
                <td className="ticket-number">
                  {ticket.ticket_number}
                </td>
                <td className="ticket-title">
                  <button 
                    className="title-link"
                    onClick={() => onTicketSelect(ticket)}
                  >
                    {ticket.title}
                  </button>
                </td>
                <td className="ticket-status">
                  {getStatusBadge(ticket.status)}
                </td>
                <td className="ticket-priority">
                  {getPriorityBadge(ticket.urgency)}
                </td>
                <td className="ticket-service">
                  {ticket.service?.name || 'N/A'}
                </td>
                <td className="ticket-employee">
                  {ticket.employee?.firstname} {ticket.employee?.lastname}
                </td>
                <td className="ticket-technician">
                  {ticket.technician ? 
                    `${ticket.technician.firstname} ${ticket.technician.lastname}` : 
                    'Non assigné'
                  }
                </td>
                <td className="ticket-date">
                  {formatDate(ticket.created_at)}
                </td>
                <td className="ticket-actions">
                  <div className="action-buttons">
                    <button
                      className="action-btn view-btn"
                      onClick={() => onTicketSelect(ticket)}
                      title="Voir les détails"
                    >
                      👁️
                    </button>
                    
                    {canTakeTicket(ticket) && (
                      <button
                        className="action-btn take-btn"
                        onClick={() => onTicketAction('take', ticket.id)}
                        title="Prendre en charge"
                      >
                        🤝
                      </button>
                    )}
                    
                    {canStartWork(ticket) && (
                      <button
                        className="action-btn start-btn"
                        onClick={() => onTicketAction('start', ticket.id)}
                        title="Démarrer le travail"
                      >
                        ▶️
                      </button>
                    )}
                    
                    {ticket.status === 'in_progress' && (
                      <button
                        className="action-btn resolve-btn"
                        onClick={() => onTicketAction('resolve', ticket.id)}
                        title="Marquer comme résolu"
                      >
                        ✅
                      </button>
                    )}
                    
                    {(ticket.technician_id === currentUser?.id || currentUser?.role === 'admin') && 
                     ticket.status !== 'resolved' && (
                      <button
                        className="action-btn transfer-btn"
                        onClick={() => onTicketAction('transfer', ticket.id)}
                        title="Transférer le ticket"
                      >
                        🔄
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedTickets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Aucun ticket trouvé</h3>
            <p>
              {selectedStatus === 'all' 
                ? 'Aucun ticket disponible pour le moment.'
                : `Aucun ticket avec le statut sélectionné.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsTable;
