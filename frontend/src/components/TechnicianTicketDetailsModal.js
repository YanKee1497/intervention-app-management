import React, { useState } from 'react';
import '../styles/TechnicianTicketDetailsModal.css';
import TransferTicketModal from './modals/TransferTicketModal';
import TransferHistory from './modals/TransferHistory';

const TechnicianTicketDetailsModal = ({ 
  ticket, 
  isOpen, 
  onClose, 
  onStatusChange, 
  onAddComment, 
  onAddFile, 
  onTransferTicket,
  currentUser 
}) => {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'pending');
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  if (!isOpen || !ticket) return null;

  const statusOptions = [
    { value: 'pending', label: 'Non pris en charge', color: '#e17055', icon: '🔴' },
    { value: 'assigned', label: 'Assigné', color: '#a29bfe', icon: '�' },
    { value: 'in_progress', label: 'En cours', color: '#74b9ff', icon: '🟡' },
    { value: 'on_hold', label: 'En attente', color: '#fdcb6e', icon: '🟠' },
    { value: 'resolved', label: 'Résolu', color: '#00b894', icon: '🟢' }
  ];

  const priorityConfig = {
    'critical': { text: 'Critique', color: '#e84393', icon: '🚨' },
    'high': { text: 'Élevé', color: '#fd79a8', icon: '🔥' },
    'medium': { text: 'Moyen', color: '#fdcb6e', icon: '⚡' },
    'low': { text: 'Faible', color: '#00b894', icon: '📋' }
  };

  const currentStatus = statusOptions.find(s => s.value === ticket.status);
  const currentPriority = priorityConfig[ticket.urgency] || priorityConfig['medium'];

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsAddingComment(true);
    try {
      await onAddComment?.(ticket.id, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleStatusChange = async () => {
    if (selectedStatus !== ticket.status) {
      await onStatusChange?.(ticket.id, selectedStatus);
      setShowStatusChange(false);
    }
  };

  const handleTransferTicket = async (transferData) => {
    try {
      await onTransferTicket?.(transferData);
      setShowTransferModal(false);
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      throw error;
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

  const canModifyTicket = () => {
    return ticket.technician_id === currentUser?.id || 
           currentUser?.role === 'admin' || 
           ticket.status === 'pending';
  };

  // Historique mock des actions
  const mockHistory = [
    {
      id: 1,
      action: 'Ticket créé',
      user: `${ticket.employee_firstname} ${ticket.employee_lastname}`,
      date: ticket.created_at,
      icon: '📝'
    },
    {
      id: 2,
      action: 'Ticket assigné',
      user: 'Système automatique',
      date: ticket.updated_at,
      icon: '👤'
    }
  ];

  return (
    <div className="modal-overlay">
      <div className="technician-ticket-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Détails du ticket</h2>
            <span className="ticket-number-badge">{ticket.ticket_number}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <div className="ticket-info-grid">
            {/* Section principale */}
            <div className="main-info">
              <div className="info-section">
                <h3>📋 Informations générales</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Sujet :</label>
                    <p>{ticket.title}</p>
                  </div>
                  <div className="info-item">
                    <label>Description :</label>
                    <p className="description">{ticket.description}</p>
                  </div>
                  <div className="info-item">
                    <label>Catégorie :</label>
                    <span className="category-badge">
                      {ticket.service_icon} {ticket.service_name || 'Support'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>👤 Employé demandeur</h3>
                <div className="employee-card">
                  <div className="employee-avatar">
                    {ticket.employee_firstname?.charAt(0)}{ticket.employee_lastname?.charAt(0)}
                  </div>
                  <div className="employee-details">
                    <h4>{ticket.employee_firstname} {ticket.employee_lastname}</h4>
                    <p>{ticket.employee_email}</p>
                    <span className="employee-role">Employé</span>
                  </div>
                </div>
              </div>

              {ticket.technician_firstname && (
                <div className="info-section">
                  <h3>🔧 Technicien assigné</h3>
                  <div className="employee-card">
                    <div className="employee-avatar tech-avatar">
                      {ticket.technician_firstname?.charAt(0)}{ticket.technician_lastname?.charAt(0)}
                    </div>
                    <div className="employee-details">
                      <h4>{ticket.technician_firstname} {ticket.technician_lastname}</h4>
                      <p>{ticket.technician_email}</p>
                      <span className="employee-role tech-role">Technicien</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section status et actions */}
            <div className="status-info">
              <div className="info-section">
                <h3>📊 Statut et priorité</h3>
                <div className="status-priority-grid">
                  <div className="status-container">
                    <label>Statut actuel :</label>
                    <div className="current-status">
                      <span 
                        className="status-badge large"
                        style={{ '--status-color': currentStatus?.color }}
                      >
                        {currentStatus?.icon} {currentStatus?.label}
                      </span>
                      {canModifyTicket() && (
                        <button 
                          className="change-status-btn"
                          onClick={() => setShowStatusChange(!showStatusChange)}
                        >
                          ⚙️ Modifier
                        </button>
                      )}
                    </div>
                    
                    {showStatusChange && (
                      <div className="status-change-panel">
                        <select 
                          value={selectedStatus} 
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="status-select"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="status-actions">
                          <button 
                            className="apply-status-btn"
                            onClick={handleStatusChange}
                          >
                            ✅ Appliquer
                          </button>
                          <button 
                            className="cancel-status-btn"
                            onClick={() => setShowStatusChange(false)}
                          >
                            ❌ Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="priority-container">
                    <label>Priorité :</label>
                    <span 
                      className="priority-badge large"
                      style={{ '--priority-color': currentPriority.color }}
                    >
                      {currentPriority.icon} {currentPriority.text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>📅 Dates importantes</h3>
                <div className="dates-grid">
                  <div className="date-item">
                    <label>Créé le :</label>
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                  <div className="date-item">
                    <label>Dernière MAJ :</label>
                    <span>{formatDate(ticket.updated_at)}</span>
                  </div>
                  {ticket.resolved_at && (
                    <div className="date-item">
                      <label>Résolu le :</label>
                      <span>{formatDate(ticket.resolved_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>📎 Pièces jointes</h3>
                <div className="attachments-list">
                  {ticket.attachment_path ? (
                    <div className="attachment-item">
                      <span className="attachment-icon">📄</span>
                      <span className="attachment-name">
                        {ticket.attachment_path.split('/').pop()}
                      </span>
                      <button className="download-btn">⬇️</button>
                    </div>
                  ) : (
                    <p className="no-attachments">Aucune pièce jointe</p>
                  )}
                  
                  {canModifyTicket() && (
                    <button 
                      className="add-file-btn"
                      onClick={() => onAddFile?.(ticket.id)}
                    >
                      📎 Ajouter un fichier
                    </button>
                  )}
                </div>

                {/* Historique des transferts */}
                {ticket.transfer_history && ticket.transfer_history.length > 0 && (
                  <TransferHistory transfers={ticket.transfer_history} />
                )}
              </div>
            </div>
          </div>

          {/* Section historique et commentaires */}
          <div className="history-comments">
            <div className="info-section">
              <h3>📝 Historique des actions</h3>
              <div className="history-timeline">
                {mockHistory.map(item => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-icon">{item.icon}</div>
                    <div className="timeline-content">
                      <div className="timeline-action">{item.action}</div>
                      <div className="timeline-user">Par {item.user}</div>
                      <div className="timeline-date">{formatDate(item.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-section">
              <h3>💬 Commentaires</h3>
              <div className="comments-list">
                <div className="comment-item">
                  <div className="comment-avatar">👤</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>{ticket.employee_firstname} {ticket.employee_lastname}</strong>
                      <span className="comment-date">{formatDate(ticket.created_at)}</span>
                    </div>
                    <p>Ticket créé avec la description initiale.</p>
                  </div>
                </div>
              </div>

              {canModifyTicket() && (
                <div className="add-comment">
                  <div className="comment-input-container">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ajouter un commentaire ou une note..."
                      className="comment-input"
                      rows="3"
                    />
                    <button 
                      className="add-comment-btn"
                      onClick={handleAddComment}
                      disabled={isAddingComment || !newComment.trim()}
                    >
                      {isAddingComment ? '⏳' : '💬'} Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="modal-footer">
          <div className="footer-left">
            <button className="export-btn" title="Exporter le ticket">
              📤 Exporter
            </button>
            <button className="print-btn" title="Imprimer">
              🖨️ Imprimer
            </button>
            {canModifyTicket() && ticket.status !== 'resolved' && (
              <button 
                className="transfer-btn"
                onClick={() => setShowTransferModal(true)}
                title="Transférer vers un autre technicien"
              >
                🔄 Transférer
              </button>
            )}
          </div>
          <div className="footer-right">
            <button className="cancel-btn" onClick={onClose}>
              Fermer
            </button>
            {canModifyTicket() && ticket.status !== 'resolved' && (
              <button 
                className="resolve-btn"
                onClick={() => onStatusChange?.(ticket.id, 'resolved')}
              >
                ✅ Marquer comme résolu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de transfert */}
      <TransferTicketModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        ticket={ticket}
        currentUser={currentUser}
        onTransfer={handleTransferTicket}
      />
    </div>
  );
};

export default TechnicianTicketDetailsModal;
