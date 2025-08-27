import React, { useState } from 'react';
import './TicketsTable.css';

const TicketsTable = ({ tickets, selectedStatus, onTicketSelect, onTicketAction, isLoading, user }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'kanban'
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filtrer les tickets selon le statut sélectionné
  const filteredTickets = tickets.filter(ticket => {
    if (selectedStatus === 'all') return true;
    return ticket.status === selectedStatus;
  });

  // Trier les tickets
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

  // Obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Non pris en charge', class: 'status-pending', icon: '🔴' },
      assigned: { label: 'Assigné', class: 'status-assigned', icon: '🟣' },
      on_hold: { label: 'En attente', class: 'status-on-hold', icon: '🟠' },
      in_progress: { label: 'En cours', class: 'status-in-progress', icon: '🟡' },
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

  // Obtenir le badge de priorité
  const getPriorityBadge = (urgency) => {
    const priorityConfig = {
      low: { label: 'Basse', class: 'priority-low' },
      medium: { label: 'Moyenne', class: 'priority-medium' },
      high: { label: 'Haute', class: 'priority-high' },
      critical: { label: 'Critique', class: 'priority-critical' }
    };

    const config = priorityConfig[urgency] || { label: urgency, class: 'priority-unknown' };
    
    return (
      <span className={`priority-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  // Vérifier si le technicien peut prendre en charge le ticket
  const canTakeTicket = (ticket) => {
    return ticket.status === 'pending' && !ticket.technician;
  };

  // Vérifier si le technicien peut démarrer le travail
  const canStartWork = (ticket) => {
    return ticket.status === 'assigned' && ticket.technician?.id === user.id;
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="tickets-table-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des tickets...</p>
        </div>
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
            <button 
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              🗂️ Kanban
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
            <option value="title-asc">Titre A-Z</option>
            <option value="title-desc">Titre Z-A</option>
          </select>
        </div>
      </div>

      {viewMode === 'table' ? (
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
                          onClick={() => onTicketAction(ticket.id, 'take')}
                          title="Prendre en charge"
                        >
                          🤝
                        </button>
                      )}
                      
                      {canStartWork(ticket) && (
                        <button
                          className="action-btn start-btn"
                          onClick={() => onTicketAction(ticket.id, 'start')}
                          title="Démarrer le travail"
                        >
                          ▶️
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
                  : `Aucun ticket avec le statut "${getStatusBadge(selectedStatus).props.children[1]}".`
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="kanban-view">
          <p>Vue Kanban en cours de développement...</p>
        </div>
      )}
    </div>
  );
};

export default TicketsTable;
