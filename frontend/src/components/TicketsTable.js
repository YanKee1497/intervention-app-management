import React, { useState } from 'react';
import '../styles/TicketsTable.css';

const TicketsTable = ({ 
  tickets, 
  onTicketAction, 
  onTicketClick, 
  currentUser,
  filteredStatus,
  searchTerm 
}) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'kanban'

  // Protection renforcée contre les données non chargées
  if (!tickets || !Array.isArray(tickets)) {
    return (
      <div className="tickets-table-container">
        <div className="loading-message">
          <p>Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  // Protection supplémentaire pour currentUser
  if (!currentUser || !currentUser.id) {
    return (
      <div className="tickets-table-container">
        <div className="loading-message">
          <p>Chargement du profil utilisateur...</p>
        </div>
      </div>
    );
  }

  // Filtrage et tri des tickets avec protection renforcée
  const filteredTickets = tickets
    .filter(ticket => ticket && ticket.id && typeof ticket.id !== 'undefined') // Protection principale
    .filter(ticket => {
      if (filteredStatus && filteredStatus !== 'all') {
        return ticket.status === filteredStatus;
      }
      return true;
    })
    .filter(ticket => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.ticket_number?.toLowerCase().includes(searchLower) ||
          ticket.title?.toLowerCase().includes(searchLower) ||
          ticket.description?.toLowerCase().includes(searchLower) ||
          ticket.employee?.firstname?.toLowerCase().includes(searchLower) ||
          ticket.employee?.lastname?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { text: 'Non pris en charge', color: '#e17055', icon: '🔴' },
      'assigned': { text: 'Assigné', color: '#a29bfe', icon: '�' },
      'in_progress': { text: 'En cours', color: '#74b9ff', icon: '🟡' },
      'resolved': { text: 'Résolu', color: '#00b894', icon: '🟢' },
      'on_hold': { text: 'En attente', color: '#fdcb6e', icon: '🟠' }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <span 
        className="status-badge"
        style={{ '--status-color': config.color }}
      >
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'critical': { text: 'Critique', color: '#e84393', icon: '🚨' },
      'high': { text: 'Élevé', color: '#fd79a8', icon: '🔥' },
      'medium': { text: 'Moyen', color: '#fdcb6e', icon: '⚡' },
      'low': { text: 'Faible', color: '#00b894', icon: '📋' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['medium'];
    
    return (
      <span 
        className="priority-badge"
        style={{ '--priority-color': config.color }}
      >
        <span className="priority-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const canTakeTicket = (ticket) => {
    try {
      if (!currentUser || !currentUser.id || !ticket || !ticket.id) return false;
      return (ticket.status === 'pending' || ticket.status === 'assigned') && 
             (!ticket.technician_id || ticket.technician_id === currentUser.id);
    } catch (error) {
      console.warn('Erreur dans canTakeTicket:', error);
      return false;
    }
  };

  const canUpdateStatus = (ticket) => {
    try {
      if (!currentUser || !currentUser.id || !ticket || !ticket.id) return false;
      return ticket.technician_id === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'manager';
    } catch (error) {
      console.warn('Erreur dans canUpdateStatus:', error);
      return false;
    }
  };

  const canStartWork = (ticket) => {
    try {
      if (!currentUser || !currentUser.id || !ticket || !ticket.id) return false;
      return ticket.status === 'assigned' && ticket.technician_id === currentUser.id;
    } catch (error) {
      console.warn('Erreur dans canStartWork:', error);
      return false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (viewMode === 'kanban') {
    return <KanbanView tickets={filteredTickets} onTicketAction={onTicketAction} currentUser={currentUser} />;
  }

  return (
    <div className="tickets-table-container">
      {/* Header avec contrôles */}
      <div className="table-header">
        <div className="table-title">
          <h2>🎫 Liste des tickets</h2>
          <span className="ticket-count">
            {filteredTickets.length} ticket(s)
          </span>
        </div>
        
        <div className="table-controls">
          <div className="view-mode-switcher">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vue tableau"
            >
              📋
            </button>
            <button 
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Vue Kanban"
            >
              📊
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des tickets */}
      <div className="table-wrapper">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Aucun ticket trouvé</h3>
            <p>
              {searchTerm 
                ? `Aucun ticket ne correspond à "${searchTerm}"`
                : filteredStatus 
                  ? `Aucun ticket avec le statut sélectionné`
                  : 'Aucun ticket disponible'
              }
            </p>
          </div>
        ) : (
          <table className="tickets-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('ticket_number')} className="sortable">
                  Numéro
                  {sortField === 'ticket_number' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('title')} className="sortable">
                  Sujet
                  {sortField === 'title' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Catégorie</th>
                <th>Employé demandeur</th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Statut
                  {sortField === 'status' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('urgency')} className="sortable">
                  Priorité
                  {sortField === 'urgency' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Date création
                  {sortField === 'created_at' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => {
                // Protection contre les tickets undefined
                if (!ticket || !ticket.id) {
                  return null;
                }
                
                return (
                <tr 
                  key={ticket.id} 
                  className={`ticket-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                  onClick={() => onTicketClick?.(ticket)}
                >
                  <td className="ticket-number">
                    <strong>{ticket.ticket_number}</strong>
                  </td>
                  <td className="ticket-title">
                    <div className="title-container">
                      <span className="title-text">{ticket.title}</span>
                      {ticket.description && (
                        <span className="title-preview">
                          {ticket.description.substring(0, 50)}...
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="category">
                    <span className="category-badge">
                      {ticket.service_icon && (
                        <span className="category-icon">{ticket.service_icon}</span>
                      )}
                      {ticket.service_name || 'Support'}
                    </span>
                  </td>
                  <td className="employee">
                    <div className="employee-info">
                      <span className="employee-name">
                        {ticket.employee?.firstname || 'N/A'} {ticket.employee?.lastname || 'N/A'}
                      </span>
                      <span className="employee-email">
                        {ticket.employee?.email || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="status">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="priority">
                    {getPriorityBadge(ticket.urgency)}
                  </td>
                  <td className="date">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <div className="action-buttons">
                      {ticket && ticket.id && canTakeTicket(ticket) && ticket.status === 'pending' && (
                        <button
                          className="action-btn take-btn"
                          onClick={() => onTicketAction('take', ticket.id)}
                          title="Prendre en charge"
                        >
                          🚀
                        </button>
                      )}
                      
                      {ticket && ticket.id && canStartWork(ticket) && (
                        <button
                          className="action-btn start-btn"
                          onClick={() => onTicketAction('start', ticket.id)}
                          title="Commencer le travail"
                        >
                          ▶️
                        </button>
                      )}
                      
                      {ticket && ticket.id && canUpdateStatus(ticket) && ticket.status !== 'resolved' && (
                        <button
                          className="action-btn status-btn"
                          onClick={() => onTicketAction('updateStatus', ticket.id)}
                          title="Changer le statut"
                        >
                          ⚙️
                        </button>
                      )}
                      
                      {ticket && ticket.id && (
                        <button
                          className="action-btn comment-btn"
                          onClick={() => onTicketAction('addComment', ticket.id)}
                          title="Ajouter un commentaire"
                        >
                          💬
                        </button>
                      )}
                      
                      {ticket && ticket.id && (
                        <button
                          className="action-btn details-btn"
                          onClick={() => onTicketAction('details', ticket.id)}
                          title="Voir les détails"
                        >
                          👁️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Composant Vue Kanban (simplifié)
const KanbanView = ({ tickets, onTicketAction, currentUser }) => {
  const statusColumns = [
    { key: 'pending', title: 'Non pris en charge', color: '#e17055' },
    { key: 'assigned', title: 'En attente', color: '#fdcb6e' },
    { key: 'in_progress', title: 'En cours', color: '#74b9ff' },
    { key: 'resolved', title: 'Résolu', color: '#00b894' }
  ];

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket && ticket.id && ticket.status === status);
  };

  return (
    <div className="kanban-view">
      <div className="kanban-columns">
        {statusColumns.map(column => (
          <div key={column.key} className="kanban-column">
            <div 
              className="kanban-header"
              style={{ '--column-color': column.color }}
            >
              <h3>{column.title}</h3>
              <span className="column-count">
                {getTicketsByStatus(column.key).length}
              </span>
            </div>
            <div className="kanban-tickets">
              {getTicketsByStatus(column.key).map(ticket => {
                // Protection contre les tickets undefined
                if (!ticket || !ticket.id) {
                  return null;
                }
                
                return (
                <div key={ticket.id} className="kanban-ticket">
                  <div className="kanban-ticket-header">
                    <strong>{ticket.ticket_number}</strong>
                    <span className="kanban-priority">
                      {ticket.urgency === 'critical' && '🚨'}
                      {ticket.urgency === 'high' && '🔥'}
                      {ticket.urgency === 'medium' && '⚡'}
                      {ticket.urgency === 'low' && '📋'}
                    </span>
                  </div>
                  <h4>{ticket.title}</h4>
                  <p className="kanban-employee">
                    👤 {ticket.employee?.firstname || 'N/A'} {ticket.employee?.lastname || 'N/A'}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsTable;
