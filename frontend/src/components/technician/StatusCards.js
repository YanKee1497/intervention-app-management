import React from 'react';
import './StatusCards.css';

const StatusCards = ({ stats, selectedStatus, onStatusChange }) => {
  const statusCards = [
    {
      key: 'pending',
      label: 'Non pris en charge',
      icon: '🔴',
      count: stats.pending || 0,
      color: '#ff6b6b'
    },
    {
      key: 'assigned',
      label: 'Assigné',
      icon: '🟣',
      count: stats.assigned || 0,
      color: '#9c88ff'
    },
    {
      key: 'on_hold',
      label: 'En attente',
      icon: '🟠',
      count: stats.on_hold || 0,
      color: '#feca57'
    },
    {
      key: 'in_progress',
      label: 'En cours',
      icon: '🟡',
      count: stats.in_progress || 0,
      color: '#48dbfb'
    },
    {
      key: 'resolved',
      label: 'Résolu',
      icon: '🟢',
      count: stats.resolved || 0,
      color: '#1dd1a1'
    }
  ];

  return (
    <div className="status-cards-container">
      <div className="status-cards-header">
        <h2>Vue d'ensemble des tickets</h2>
        <p>Filtrez par statut pour voir les détails</p>
      </div>
      
      <div className="status-cards-grid">
        {statusCards.map(card => (
          <div
            key={card.key}
            className={`status-card ${selectedStatus === card.key ? 'active' : ''} ${selectedStatus === 'all' ? 'show-all' : ''}`}
            onClick={() => onStatusChange(card.key)}
            style={{
              '--card-color': card.color,
              '--card-color-light': card.color + '20'
            }}
          >
            <div className="status-card-content">
              <div className="status-card-icon">
                {card.icon}
              </div>
              <div className="status-card-info">
                <div className="status-card-count">
                  {card.count}
                </div>
                <div className="status-card-label">
                  {card.label}
                </div>
              </div>
            </div>
            <div className="status-card-hover-effect"></div>
          </div>
        ))}
        
        {/* Carte "Tous" */}
        <div
          className={`status-card all-card ${selectedStatus === 'all' ? 'active' : ''}`}
          onClick={() => onStatusChange('all')}
        >
          <div className="status-card-content">
            <div className="status-card-icon">
              📋
            </div>
            <div className="status-card-info">
              <div className="status-card-count">
                {Object.values(stats).reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="status-card-label">
                Tous
              </div>
            </div>
          </div>
          <div className="status-card-hover-effect"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusCards;
