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
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'kanban'
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [draggedTicket, setDraggedTicket] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Protection contre user undefined
  if (!user || !user.id) {
    return (
      <div className="tickets-table-loading">
        <div className="loading-message">
          <p>Chargement du profil utilisateur...</p>
        </div>
      </div>
    );
  }

  // Protection contre tickets undefined ou vides
  if (!tickets || !Array.isArray(tickets)) {
    return (
      <div className="tickets-table-loading">
        <div className="loading-message">
          <p>Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  // Filtrer les tickets selon le statut sélectionné avec protection
  const filteredTickets = tickets.filter(ticket => {
    if (!ticket || !ticket.id) return false;
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

  // Obtenir le badge de priorité
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

  // Obtenir le badge d'urgence
  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      low: { label: 'Faible', class: 'urgency-low', icon: '🟢' },
      medium: { label: 'Moyenne', class: 'urgency-medium', icon: '🟡' },
      high: { label: 'Haute', class: 'urgency-high', icon: '🔴' },
      critical: { label: 'Critique', class: 'urgency-critical', icon: '🆘' }
    };

    const config = urgencyConfig[urgency] || { label: urgency, class: 'urgency-unknown', icon: '❓' };
    
    return (
      <span className={`urgency-badge ${config.class}`}>
        <span className="urgency-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Organiser les tickets par statut pour la vue Kanban
  const getTicketsByStatus = () => {
    const statusColumns = {
      pending: { label: 'Non pris en charge', tickets: [], color: '#FEF2F2' },
      assigned: { label: 'Assignés', tickets: [], color: '#F3F0FF' },
      on_hold: { label: 'En attente', tickets: [], color: '#FEF3C7' },
      in_progress: { label: 'En cours', tickets: [], color: '#DBEAFE' },
      resolved: { label: 'Résolus', tickets: [], color: '#D1FAE5' }
    };

    tickets.forEach(ticket => {
      if (ticket && ticket.id && statusColumns[ticket.status]) {
        statusColumns[ticket.status].tickets.push(ticket);
      }
    });

    return statusColumns;
  };

  // Fonctions de capacité
  const canTakeTicket = (ticket) => {
    if (!ticket || !user) return false;
    return ticket.status === 'pending' || (ticket.status === 'assigned' && !ticket.technician_id);
  };

  const canStartWork = (ticket) => {
    if (!ticket || !user) return false;
    return ticket.status === 'assigned' && ticket.technician_id === user.id;
  };

  // Gestion du drag and drop
  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, status) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTicket && draggedTicket.status !== newStatus) {
      onTicketAction('changeStatus', draggedTicket.id, newStatus);
    }
    setDraggedTicket(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTicket(null);
    setDragOverColumn(null);
  };

  // Rendu d'une carte de ticket pour la vue Kanban
  const renderKanbanCard = (ticket) => {
    if (!ticket || !ticket.id) return null;
    
    return (
    <div 
      key={ticket.id} 
      className="kanban-card" 
      draggable="true"
      onDragStart={(e) => handleDragStart(e, ticket)}
      onDragEnd={handleDragEnd}
      onClick={() => onTicketSelect(ticket)}
      style={{
        cursor: 'grab',
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseDown={(e) => e.target.style.cursor = 'grabbing'}
      onMouseUp={(e) => e.target.style.cursor = 'grab'}
    >
      <div className="kanban-card-header">
        <span className="ticket-number">#{ticket.ticket_number}</span>
        {getUrgencyBadge(ticket.urgency)}
      </div>
      
      <div className="kanban-card-title">
        {ticket.title}
      </div>
      
      <div className="kanban-card-description">
        {ticket.description && ticket.description.length > 100 
          ? `${ticket.description.substring(0, 100)}...` 
          : ticket.description || 'Pas de description'
        }
      </div>
      
      <div className="kanban-card-footer">
        <div className="card-meta">
          <span className="service-tag">{ticket.service?.name}</span>
          <span className="created-date">
            {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>
        
        <div className="card-actions">
          {canTakeTicket(ticket) && (
            <button
              className="kanban-action-btn take"
              onClick={(e) => {
                e.stopPropagation();
                onTicketAction('take', ticket.id);
              }}
              title="Prendre en charge"
            >
              🤝
            </button>
          )}
          
          {canStartWork(ticket) && (
            <button
              className="kanban-action-btn start"
              onClick={(e) => {
                e.stopPropagation();
                onTicketAction('start', ticket.id);
              }}
              title="Démarrer"
            >
              ▶️
            </button>
          )}
          
          {ticket.status === 'in_progress' && (
            <button
              className="kanban-action-btn resolve"
              onClick={(e) => {
                e.stopPropagation();
                onTicketAction('resolve', ticket.id);
              }}
              title="Marquer comme résolu"
            >
              ✅
            </button>
          )}
          
          {(ticket.technician_id === currentUser?.id || currentUser?.role === 'admin') && 
           ticket.status !== 'resolved' && (
            <button
              className="kanban-action-btn transfer"
              onClick={(e) => {
                e.stopPropagation();
                onTicketAction('transfer', ticket.id);
              }}
              title="Transférer"
            >
              🔄
            </button>
          )}
        </div>
      </div>
    </div>
    );
  };

  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
      {/* En-tête avec contrôles */}
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
      ) : (
        <div className="kanban-view">
          <div className="kanban-board">
            {Object.entries(getTicketsByStatus()).map(([status, column]) => (
              <div 
                key={status} 
                className={`kanban-column ${dragOverColumn === status ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="kanban-column-header" style={{ backgroundColor: column.color }}>
                  <div className="column-title">
                    <span className="status-icon">{getStatusBadge(status).props.children[0]}</span>
                    {column.label}
                  </div>
                  <span className="column-count">{column.tickets.length}</span>
                </div>
                
                <div className="kanban-column-content">
                  {column.tickets.length === 0 ? (
                    <div className="kanban-empty-state">
                      <div className="empty-icon">📋</div>
                      <p>Aucun ticket</p>
                    </div>
                  ) : (
                    column.tickets.map(ticket => renderKanbanCard(ticket))
                  )}
                </div>
                
                {status === 'pending' && (
                  <div className="kanban-column-footer">
                    <button 
                      className="add-ticket-btn"
                      onClick={() => onNewTicket && onNewTicket()}
                    >
                      ➕ Nouveau ticket
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsTable;
