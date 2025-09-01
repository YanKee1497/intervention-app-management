import React from 'react';
import './TransferHistory.css';

const TransferHistory = ({ transfers = [] }) => {
  if (!transfers || transfers.length === 0) {
    return (
      <div className="transfer-history-empty">
        <p>Aucun transfert effectué sur ce ticket</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'normal': { text: 'Normal', color: '#00b894', icon: '🔄' },
      'urgent': { text: 'Urgent', color: '#fdcb6e', icon: '⚡' },
      'emergency': { text: 'Urgence', color: '#e17055', icon: '🚨' }
    };
    
    return priorityConfig[priority] || priorityConfig['normal'];
  };

  return (
    <div className="transfer-history">
      <h4>🔄 Historique des transferts</h4>
      <div className="transfer-timeline">
        {transfers.map((transfer, index) => {
          const priorityBadge = getPriorityBadge(transfer.priority);
          
          return (
            <div key={index} className="transfer-item">
              <div className="transfer-indicator">
                <div className="transfer-icon">🔄</div>
                {index < transfers.length - 1 && <div className="transfer-line"></div>}
              </div>
              
              <div className="transfer-content">
                <div className="transfer-header">
                  <div className="transfer-info">
                    <span className="transfer-action">Transféré</span>
                    <span 
                      className="transfer-priority"
                      style={{ color: priorityBadge.color }}
                    >
                      {priorityBadge.icon} {priorityBadge.text}
                    </span>
                  </div>
                  <div className="transfer-date">
                    {formatDate(transfer.timestamp)}
                  </div>
                </div>
                
                <div className="transfer-details">
                  <div className="transfer-participants">
                    <div className="participant from">
                      <span className="participant-label">De:</span>
                      <div className="participant-info">
                        <div className="participant-avatar">
                          {transfer.from?.firstname?.charAt(0)}{transfer.from?.lastname?.charAt(0)}
                        </div>
                        <div className="participant-name">
                          {transfer.from?.firstname} {transfer.from?.lastname}
                        </div>
                      </div>
                    </div>
                    
                    <div className="transfer-arrow">→</div>
                    
                    <div className="participant to">
                      <span className="participant-label">Vers:</span>
                      <div className="participant-info">
                        <div className="participant-avatar">
                          {transfer.to?.firstname?.charAt(0)}{transfer.to?.lastname?.charAt(0)}
                        </div>
                        <div className="participant-name">
                          {transfer.to?.firstname} {transfer.to?.lastname}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {transfer.reason && (
                    <div className="transfer-reason">
                      <strong>Raison:</strong> {transfer.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransferHistory;
