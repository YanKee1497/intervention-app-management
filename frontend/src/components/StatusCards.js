import React from 'react';
import '../styles/StatusCards.css';

const StatusCards = ({ stats, onCardClick, activeFilter }) => {
  const statusCards = [
    {
      key: 'unassigned',
      title: 'Non pris en charge',
      icon: '🔴',
      count: stats?.unassigned || 0,
      color: '#e17055',
      bgColor: '#ffeaa7'
    },
    {
      key: 'assigned',
      title: 'Assignés',
      icon: '🟣',
      count: stats?.assigned || 0,
      color: '#a29bfe',
      bgColor: '#f0efff'
    },
    {
      key: 'on_hold',
      title: 'En attente',
      icon: '🟠',
      count: stats?.on_hold || 0,
      color: '#fdcb6e',
      bgColor: '#fff3cd'
    },
    {
      key: 'in_progress',
      title: 'En cours',
      icon: '🟡',
      count: stats?.in_progress || 0,
      color: '#74b9ff',
      bgColor: '#d1ecf1'
    },
    {
      key: 'resolved',
      title: 'Résolus',
      icon: '🟢',
      count: stats?.resolved || 0,
      color: '#00b894',
      bgColor: '#d4edda'
    }
  ];

  return (
    <div className="status-cards-container">
      <h2 className="status-cards-title">📊 Récapitulatif des tickets</h2>
      <div className="status-cards-grid">
        {statusCards.map((card) => (
          <div
            key={card.key}
            className={`status-card ${activeFilter === card.key ? 'active' : ''}`}
            onClick={() => onCardClick(card.key)}
            style={{
              '--card-color': card.color,
              '--card-bg-color': card.bgColor
            }}
          >
            <div className="status-card-icon">
              {card.icon}
            </div>
            <div className="status-card-content">
              <div className="status-card-number">
                {card.count}
              </div>
              <div className="status-card-label">
                {card.title}
              </div>
            </div>
            <div className="status-card-arrow">
              →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusCards;
