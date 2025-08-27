import React from 'react';
import './StatusCards.css';

const StatusCards = ({ stats, selectedStatus, onStatusChange }) => {
  const statusCards = [
    {
      key: 'pending',
      label: 'Tickets non pris en charge',
      count: stats.pending || 0,
      color: '#FEF2F2',
      iconColor: '#DC2626',
      icon: '🔴',
      description: 'Aucun technicien n\'a encore pris ou reçu le ticket. Il est en attente d\'assignation.'
    },
    {
      key: 'assigned',
      label: 'Tickets assignés',
      count: stats.assigned || 0,
      color: '#F3F0FF',
      iconColor: '#7C3AED',
      icon: '🟣',
      description: 'Tickets attribués à un technicien par le manager, mais pas encore commencés.'
    },
    {
      key: 'on_hold',
      label: 'Tickets en attente',
      count: stats.on_hold || 0,
      color: '#FEF3C7',
      iconColor: '#F59E0B',
      icon: '�',
      description: 'Tickets bloqués en attente d\'une action extérieure (pièces, validation, infos).'
    },
    {
      key: 'in_progress',
      label: 'Tickets en cours',
      count: stats.in_progress || 0,
      color: '#FEF3C7',
      iconColor: '#EAB308',
      icon: '🟡',
      description: 'Le technicien travaille activement dessus.'
    },
    {
      key: 'resolved',
      label: 'Tickets résolus',
      count: stats.resolved || 0,
      color: '#D1FAE5',
      iconColor: '#10B981',
      icon: '🟢',
      description: 'Le problème est réglé et le ticket clôturé.'
    }
  ];

  return (
    <div className="status-cards-container">      
      <div className="status-cards-grid">
        {statusCards.map(card => (
          <div
            key={card.key}
            className={`status-card ${selectedStatus === card.key ? 'active' : ''}`}
            onClick={() => onStatusChange(card.key)}
            style={{ backgroundColor: card.color }}
          >
            <div className="status-card-content">
              <div className="status-card-left">
                <div 
                  className="status-card-icon"
                  style={{ color: card.iconColor }}
                >
                  {card.icon}
                </div>
              </div>
              <div className="status-card-right">
                <div className="status-card-count">
                  {card.count}
                </div>
                <div className="status-card-label">
                  {card.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusCards;
