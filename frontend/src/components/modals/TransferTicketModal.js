import React, { useState, useEffect } from 'react';
import './TransferTicketModal.css';

const TransferTicketModal = ({ 
  isOpen, 
  onClose, 
  ticket, 
  onTransfer, 
  currentUser 
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transferPriority, setTransferPriority] = useState('normal');

  // Mock data des techniciens disponibles
  useEffect(() => {
    if (isOpen) {
      setAvailableTechnicians([
        {
          id: 1,
          firstname: 'Marie',
          lastname: 'Dubois',
          email: 'marie.dubois@entreprise.com',
          specialties: ['Informatique', 'Réseau'],
          currentWorkload: 3,
          maxWorkload: 8,
          availability: 'available',
          rating: 4.8
        },
        {
          id: 2,
          firstname: 'Pierre',
          lastname: 'Martin',
          email: 'pierre.martin@entreprise.com',
          specialties: ['Maintenance', 'Équipement'],
          currentWorkload: 5,
          maxWorkload: 8,
          availability: 'available',
          rating: 4.6
        },
        {
          id: 3,
          firstname: 'Sophie',
          lastname: 'Leroy',
          email: 'sophie.leroy@entreprise.com',
          specialties: ['Informatique', 'Support'],
          currentWorkload: 7,
          maxWorkload: 8,
          availability: 'busy',
          rating: 4.9
        },
        {
          id: 4,
          firstname: 'Thomas',
          lastname: 'Blanc',
          email: 'thomas.blanc@entreprise.com',
          specialties: ['Électricité', 'Maintenance'],
          currentWorkload: 2,
          maxWorkload: 8,
          availability: 'available',
          rating: 4.7
        }
      ].filter(tech => tech.id !== currentUser?.id)); // Exclure l'utilisateur actuel
    }
  }, [isOpen, currentUser]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!selectedTechnician || !transferReason.trim()) {
      alert('Veuillez sélectionner un technicien et indiquer une raison de transfert');
      return;
    }

    setIsLoading(true);
    try {
      const selectedTech = availableTechnicians.find(t => t.id.toString() === selectedTechnician);
      
      await onTransfer?.({
        ticketId: ticket.id,
        fromTechnician: currentUser,
        toTechnician: selectedTech,
        reason: transferReason,
        priority: transferPriority,
        timestamp: new Date().toISOString()
      });
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      alert('Erreur lors du transfert du ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTechnician('');
    setTransferReason('');
    setTransferPriority('normal');
  };

  const getWorkloadPercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  const getAvailabilityBadge = (availability, workload) => {
    if (availability === 'available' && workload < 75) {
      return { text: 'Disponible', color: '#00b894', icon: '🟢' };
    } else if (availability === 'available' && workload >= 75) {
      return { text: 'Occupé', color: '#fdcb6e', icon: '🟡' };
    } else {
      return { text: 'Très occupé', color: '#e17055', icon: '🔴' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="transfer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="transfer-modal-header">
          <h2>🔄 Transférer le ticket</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="transfer-modal-content">
          <div className="current-ticket-info">
            <h3>📋 Ticket à transférer</h3>
            <div className="ticket-summary">
              <div className="ticket-id">#{ticket.ticket_number}</div>
              <div className="ticket-title">{ticket.title}</div>
              <div className="ticket-meta">
                <span className="service-tag">{ticket.service_name}</span>
                <span className={`priority-badge priority-${ticket.urgency}`}>
                  {ticket.urgency}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleTransfer} className="transfer-form">
            <div className="form-section">
              <h3>👤 Sélectionner le technicien destinataire</h3>
              <div className="technicians-grid">
                {availableTechnicians.map(tech => {
                  const workloadPercent = getWorkloadPercentage(tech.currentWorkload, tech.maxWorkload);
                  const availability = getAvailabilityBadge(tech.availability, workloadPercent);
                  
                  return (
                    <div
                      key={tech.id}
                      className={`technician-card ${selectedTechnician === tech.id.toString() ? 'selected' : ''}`}
                      onClick={() => setSelectedTechnician(tech.id.toString())}
                    >
                      <div className="tech-header">
                        <div className="tech-avatar">
                          {tech.firstname.charAt(0)}{tech.lastname.charAt(0)}
                        </div>
                        <div className="tech-info">
                          <h4>{tech.firstname} {tech.lastname}</h4>
                          <p>{tech.email}</p>
                        </div>
                        <div className="availability-badge" style={{ color: availability.color }}>
                          {availability.icon} {availability.text}
                        </div>
                      </div>
                      
                      <div className="tech-details">
                        <div className="specialties">
                          <strong>Spécialités:</strong>
                          <div className="specialty-tags">
                            {tech.specialties.map((spec, index) => (
                              <span key={index} className="specialty-tag">{spec}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="workload-info">
                          <div className="workload-text">
                            <strong>Charge de travail:</strong> {tech.currentWorkload}/{tech.maxWorkload} tickets
                          </div>
                          <div className="workload-bar">
                            <div 
                              className="workload-fill" 
                              style={{ 
                                width: `${workloadPercent}%`,
                                backgroundColor: workloadPercent < 50 ? '#00b894' : 
                                               workloadPercent < 75 ? '#fdcb6e' : '#e17055'
                              }}
                            ></div>
                          </div>
                          <span className="workload-percent">{workloadPercent}%</span>
                        </div>
                        
                        <div className="rating">
                          <strong>Note:</strong> ⭐ {tech.rating}/5
                        </div>
                      </div>
                      
                      {selectedTechnician === tech.id.toString() && (
                        <div className="selected-indicator">✅ Sélectionné</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3>📝 Détails du transfert</h3>
              
              <div className="form-group">
                <label htmlFor="transfer-reason">Raison du transfert *</label>
                <textarea
                  id="transfer-reason"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous transférez ce ticket..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="transfer-priority">Priorité du transfert</label>
                <select
                  id="transfer-priority"
                  value={transferPriority}
                  onChange={(e) => setTransferPriority(e.target.value)}
                >
                  <option value="normal">🔄 Normal</option>
                  <option value="urgent">⚡ Urgent</option>
                  <option value="emergency">🚨 Urgence</option>
                </select>
              </div>
            </div>

            <div className="transfer-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="transfer-btn"
                disabled={isLoading || !selectedTechnician || !transferReason.trim()}
              >
                {isLoading ? '🔄 Transfert...' : '✅ Confirmer le transfert'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferTicketModal;
