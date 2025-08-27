import React, { useState, useEffect } from 'react';
import './TechnicianTicketDetailsModal.css';

const TechnicianTicketDetailsModal = ({ ticket, isOpen, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (isOpen && ticket) {
      loadTicketDetails();
    }
  }, [isOpen, ticket]);

  const loadTicketDetails = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des détails du ticket
      setTimeout(() => {
        setComments([
          {
            id: 1,
            author: 'Jean Dupont',
            role: 'Employé',
            content: 'Mon ordinateur ne démarre plus depuis ce matin. J\'ai essayé de le redémarrer plusieurs fois.',
            timestamp: '2024-01-15 08:30:00',
            type: 'user'
          },
          {
            id: 2,
            author: 'Marie Martin',
            role: 'Technicien',
            content: 'Prise en charge du ticket. Je vais vérifier l\'alimentation et les connexions.',
            timestamp: '2024-01-15 09:15:00',
            type: 'technician'
          }
        ]);
        setAttachments([
          {
            id: 1,
            name: 'photo_probleme.jpg',
            size: '2.5 MB',
            type: 'image',
            uploadedBy: 'Jean Dupont',
            uploadedAt: '2024-01-15 08:32:00'
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusChange(ticket.id, newStatus);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const comment = {
        id: comments.length + 1,
        author: 'Technicien Connecté',
        role: 'Technicien',
        content: newComment,
        timestamp: new Date().toLocaleString('fr-FR'),
        type: 'technician'
      };
      setComments([...comments, comment]);
      setNewComment('');
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Non pris en charge', icon: '🔴', color: '#c62828' },
      'assigned': { label: 'Assigné', icon: '🟣', color: '#7b1fa2' },
      'on_hold': { label: 'En attente', icon: '🟠', color: '#ef6c00' },
      'in_progress': { label: 'En cours', icon: '🟡', color: '#1565c0' },
      'resolved': { label: 'Résolu', icon: '🟢', color: '#2e7d32' }
    };
    return statusMap[status] || { label: status, icon: '⚪', color: '#636e72' };
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      'low': { label: 'Faible', color: '#2e7d32' },
      'medium': { label: 'Moyenne', color: '#ef6c00' },
      'high': { label: 'Élevée', color: '#c62828' },
      'critical': { label: 'Critique', color: '#ad1457' }
    };
    return priorityMap[priority] || { label: priority, color: '#636e72' };
  };

  const canTakeTicket = (status) => status === 'pending';
  const canStartWork = (status) => status === 'assigned';
  const canPutOnHold = (status) => status === 'in_progress';
  const canResolve = (status) => status === 'in_progress';

  if (!isOpen || !ticket) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Ticket #{ticket.number}</h2>
            <div className="ticket-meta">
              <span className={`status-badge status-${ticket.status}`}>
                {getStatusInfo(ticket.status).icon} {getStatusInfo(ticket.status).label}
              </span>
              <span className={`priority-badge priority-${ticket.priority}`}>
                {getPriorityInfo(ticket.priority).label}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}

          <div className="ticket-info-section">
            <h3>📋 Informations du ticket</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Titre:</label>
                <span>{ticket.title}</span>
              </div>
              <div className="info-item">
                <label>Demandeur:</label>
                <span>{ticket.requester}</span>
              </div>
              <div className="info-item">
                <label>Catégorie:</label>
                <span>{ticket.category}</span>
              </div>
              <div className="info-item">
                <label>Date de création:</label>
                <span>{new Date(ticket.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <div className="info-item">
                <label>Dernière mise à jour:</label>
                <span>{new Date(ticket.updated_at).toLocaleString('fr-FR')}</span>
              </div>
              <div className="info-item">
                <label>Assigné à:</label>
                <span>{ticket.assigned_to || 'Non assigné'}</span>
              </div>
            </div>
            <div className="description">
              <label>Description:</label>
              <p>{ticket.description}</p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="quick-actions">
            <h3>⚡ Actions rapides</h3>
            <div className="action-buttons">
              {canTakeTicket(ticket.status) && (
                <button 
                  className="action-btn take-btn"
                  onClick={() => handleStatusChange('assigned')}
                  disabled={loading}
                >
                  🟣 Prendre en charge
                </button>
              )}
              {canStartWork(ticket.status) && (
                <button 
                  className="action-btn start-btn"
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={loading}
                >
                  🟡 Commencer le travail
                </button>
              )}
              {canPutOnHold(ticket.status) && (
                <button 
                  className="action-btn hold-btn"
                  onClick={() => handleStatusChange('on_hold')}
                  disabled={loading}
                >
                  🟠 Mettre en attente
                </button>
              )}
              {canResolve(ticket.status) && (
                <button 
                  className="action-btn resolve-btn"
                  onClick={() => handleStatusChange('resolved')}
                  disabled={loading}
                >
                  🟢 Marquer comme résolu
                </button>
              )}
            </div>
          </div>

          {/* Pièces jointes */}
          {attachments.length > 0 && (
            <div className="attachments-section">
              <h3>📎 Pièces jointes</h3>
              <div className="attachments-list">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="attachment-item">
                    <div className="attachment-icon">
                      {attachment.type === 'image' ? '🖼️' : '📄'}
                    </div>
                    <div className="attachment-info">
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-meta">
                        {attachment.size} • Par {attachment.uploadedBy}
                      </span>
                    </div>
                    <button className="download-btn">⬇️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique des commentaires */}
          <div className="comments-section">
            <h3>💬 Historique des commentaires</h3>
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className={`comment-item ${comment.type}`}>
                  <div className="comment-header">
                    <div className="comment-author">
                      <span className="author-name">{comment.author}</span>
                      <span className="author-role">({comment.role})</span>
                    </div>
                    <span className="comment-time">{comment.timestamp}</span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))}
            </div>

            {/* Ajouter un commentaire */}
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire technique..."
                rows="3"
              />
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || loading}
                className="submit-comment-btn"
              >
                💬 Ajouter un commentaire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianTicketDetailsModal;
