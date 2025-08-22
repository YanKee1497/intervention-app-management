import React from 'react';
import { getStatusColor, getUrgencyColor, formatDate } from '../utils/helpers';
import '../styles/TicketCard.css';

const TicketCard = ({ ticket, onTake, showTakeButton, showAssignButton }) => {
  const getServiceIcon = (icon) => {
    const icons = {
      wrench: '🔧',
      computer: '💻',
      truck: '🚛',
      cleaning: '🧹',
      shield: '🛡️'
    };
    return icons[icon] || '📋';
  };

  const handleTakeTicket = () => {
    if (onTake) {
      onTake(ticket.id);
    }
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <div className="service-info">
          <span className="service-icon">
            {getServiceIcon(ticket.service_icon)}
          </span>
          <div className="ticket-main-info">
            <h4>{ticket.title}</h4>
            <p className="ticket-number">{ticket.ticket_number}</p>
          </div>
        </div>
        <div className={`status-badge ${getStatusColor(ticket.status)}`}>
          {getStatusDisplayName(ticket.status)}
        </div>
      </div>

      <div className="ticket-body">
        <p className="ticket-description">{ticket.description}</p>
        
        <div className="ticket-meta">
          <div className={`urgency-badge ${getUrgencyColor(ticket.urgency)}`}>
            {getUrgencyDisplayName(ticket.urgency)}
          </div>
          <span className="ticket-date">{formatDate(ticket.created_at)}</span>
        </div>

        {ticket.employee_firstname && (
          <div className="ticket-people">
            <span className="demandeur">
              Demandeur: {ticket.employee_firstname} {ticket.employee_lastname}
            </span>
          </div>
        )}

        {ticket.technician_firstname && (
          <div className="ticket-people">
            <span className="technicien">
              Technicien: {ticket.technician_firstname} {ticket.technician_lastname}
            </span>
          </div>
        )}
      </div>

      <div className="ticket-actions">
        {showTakeButton && (
          <button 
            className="take-button"
            onClick={handleTakeTicket}
          >
            Prendre en charge
          </button>
        )}
        
        {showAssignButton && (
          <button className="assign-button">
            Assigner
          </button>
        )}

        <button className="details-button">
          Voir détails
        </button>
      </div>
    </div>
  );
};

const getStatusDisplayName = (status) => {
  const statusNames = {
    pending: 'En attente',
    assigned: 'Assigné',
    in_progress: 'En cours',
    resolved: 'Résolu',
    rejected: 'Rejeté'
  };
  return statusNames[status] || status;
};

const getUrgencyDisplayName = (urgency) => {
  const urgencyNames = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    critical: 'Critique'
  };
  return urgencyNames[urgency] || urgency;
};

export default TicketCard;
