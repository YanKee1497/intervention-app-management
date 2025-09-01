import React, { useState, useEffect, useRef } from 'react';
import './NotificationsModal.css';

const NotificationsModal = ({ isOpen, onClose, user, onTicketClick }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'priority'
  const [notifications, setNotifications] = useState([])
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showBulkActions, setShowBulkActions] = useState(false)
  const modalRef = useRef(null)

  // Données de démonstration des notifications complètes avec plus de variété
  const mockNotifications = [
    {
      id: 1,
      title: 'Nouveau ticket urgent assigné',
      message: 'Le ticket TCK-007 (Panne serveur critique) vous a été assigné avec une priorité élevée. Intervention requise immédiatement.',
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Il y a 5 minutes
      type: 'assignment',
      priority: 'high',
      unread: true,
      relatedTicket: 'TCK-007',
      icon: '🆘',
      category: 'Technique',
      sender: 'Système automatique'
    },
    {
      id: 2,
      title: 'Ticket résolu avec succès',
      message: 'Le ticket TCK-003 (Problème imprimante Bureau 201) a été marqué comme résolu. Le client a confirmé la résolution.',
      time: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // Il y a 1h15
      type: 'resolution',
      priority: 'medium',
      unread: true,
      relatedTicket: 'TCK-003',
      icon: '✅',
      category: 'Résolution',
      sender: 'Marie Dubois'
    },
    {
      id: 3,
      title: 'Nouveau commentaire ajouté',
      message: 'Un commentaire a été ajouté sur le ticket TCK-001 par Jean Dupont: "Le problème persiste malgré les tentatives de redémarrage. Besoin d\'une intervention plus poussée."',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
      type: 'comment',
      priority: 'medium',
      unread: true,
      relatedTicket: 'TCK-001',
      icon: '💬',
      category: 'Communication',
      sender: 'Jean Dupont'
    },
    {
      id: 4,
      title: 'Rappel: Ticket en attente',
      message: 'Le ticket TCK-005 (Configuration réseau Salle de réunion) est en attente depuis plus de 2 heures. Veuillez vérifier si une intervention est nécessaire.',
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // Il y a 3h
      type: 'reminder',
      priority: 'medium',
      unread: false,
      relatedTicket: 'TCK-005',
      icon: '⏰',
      category: 'Rappel',
      sender: 'Système automatique'
    },
    {
      id: 5,
      title: 'Maintenance programmée',
      message: 'Maintenance serveur prévue demain de 14h à 16h. Préparez vos interventions en conséquence. Tous les services seront temporairement indisponibles.',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Il y a 4h
      type: 'maintenance',
      priority: 'high',
      unread: false,
      relatedTicket: null,
      icon: '🔧',
      category: 'Maintenance',
      sender: 'Service IT'
    },
    {
      id: 6,
      title: 'Nouveau ticket assigné',
      message: 'Le ticket TCK-006 (Problème connexion Wi-Fi Étage 3) vous a été assigné automatiquement selon vos compétences.',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Il y a 6h
      type: 'assignment',
      priority: 'low',
      unread: false,
      relatedTicket: 'TCK-006',
      icon: '📋',
      category: 'Réseau',
      sender: 'Système automatique'
    },
    {
      id: 7,
      title: 'Mise à jour système',
      message: 'Le système de gestion des tickets sera mis à jour ce weekend. Nouvelles fonctionnalités disponibles: drag & drop, notifications temps réel, statistiques avancées.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
      type: 'system',
      priority: 'low',
      unread: false,
      relatedTicket: null,
      icon: '⬆️',
      category: 'Système',
      sender: 'Administration'
    },
    {
      id: 8,
      title: 'Ticket escaladé',
      message: 'Le ticket TCK-002 (Problème serveur de base de données) a été escaladé vers le niveau 2 support en raison de sa complexité technique.',
      time: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // Il y a 30h
      type: 'escalation',
      priority: 'high',
      unread: false,
      relatedTicket: 'TCK-002',
      icon: '⬆️',
      category: 'Escalade',
      sender: 'Support Niveau 1'
    },
    {
      id: 9,
      title: 'Rapport hebdomadaire disponible',
      message: 'Votre rapport de performance hebdomadaire est maintenant disponible. Vous avez résolu 12 tickets cette semaine avec un taux de satisfaction de 95%.',
      time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 7 jours
      type: 'report',
      priority: 'low',
      unread: false,
      relatedTicket: null,
      icon: '📊',
      category: 'Rapport',
      sender: 'Système RH'
    },
    {
      id: 10,
      title: 'Formation obligatoire',
      message: 'Nouvelle formation sur les protocoles de sécurité informatique disponible. Inscription obligatoire avant le 15 du mois.',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
      type: 'training',
      priority: 'medium',
      unread: true,
      relatedTicket: null,
      icon: '🎓',
      category: 'Formation',
      sender: 'Service Formation'
    }
  ];

  // Initialiser les notifications au chargement
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      // Simuler un chargement depuis l'API
      setTimeout(() => {
        setNotifications(mockNotifications)
        setIsLoading(false)
      }, 500)
    }
  }, [isOpen])

  // Gérer l'échappement pour fermer le modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null;

  // Filtrer les notifications avec recherche
  const filteredNotifications = notifications.filter(notification => {
    // Filtre par statut lu/non lu
    const statusMatch = filter === 'all' || 
                       (filter === 'unread' && notification.unread) || 
                       (filter === 'read' && !notification.unread)
    
    // Filtre par terme de recherche
    const searchMatch = !searchTerm || 
                       notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       notification.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       notification.relatedTicket?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return statusMatch && searchMatch
  })

  // Trier les notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.time) - new Date(a.time);
    }
    if (sortBy === 'oldest') {
      return new Date(a.time) - new Date(b.time);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'À l\'instant';
    if (diffInMins < 60) return `Il y a ${diffInMins} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'assignment': return 'type-assignment';
      case 'resolution': return 'type-resolution';
      case 'comment': return 'type-comment';
      case 'reminder': return 'type-reminder';
      case 'maintenance': return 'type-maintenance';
      case 'system': return 'type-system';
      case 'escalation': return 'type-escalation';
      case 'report': return 'type-report';
      case 'training': return 'type-training';
      default: return 'type-default';
    }
  };

  // Fonctions d'action améliorées
  const handleNotificationClick = (notification) => {
    console.log('📱 Notification cliquée:', notification);
    
    // Marquer comme lue avec animation
    if (notification.unread) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, unread: false }
            : n
        )
      )
      
      // Effet visuel de lecture
      const notifElement = document.querySelector(`[data-notification-id="${notification.id}"]`)
      if (notifElement) {
        notifElement.classList.add('marking-as-read')
        setTimeout(() => {
          notifElement.classList.remove('marking-as-read')
        }, 300)
      }
    }
    
    // Si c'est lié à un ticket, ouvrir le détail
    if (notification.relatedTicket && onTicketClick) {
      onTicketClick(notification.relatedTicket)
      onClose() // Fermer le modal après redirection
    }
    
    // Envoyer notification système
    if ('Notification' in window) {
      new Notification(`Action sur ${notification.title}`, {
        body: 'Notification marquée comme lue',
        icon: '/favicon.ico'
      })
    }
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => n.unread).map(n => n.id)
    
    if (unreadIds.length === 0) {
      alert('Aucune notification non lue à marquer !')
      return
    }
    
    setIsLoading(true)
    
    // Simuler l'appel API
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, unread: false }))
      )
      setIsLoading(false)
      
      // Notification de succès
      console.log(`✅ ${unreadIds.length} notifications marquées comme lues`)
      
      // Animation de success
      const button = document.querySelector('.mark-all-read-btn')
      if (button) {
        button.textContent = '✅ Terminé!'
        setTimeout(() => {
          button.textContent = '📖 Tout marquer comme lu'
        }, 2000)
      }
    }, 1000)
  };

  const handleDeleteNotification = (notificationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      return
    }
    
    console.log('🗑️ Suppression notification:', notificationId);
    
    // Animation de suppression
    const notifElement = document.querySelector(`[data-notification-id="${notificationId}"]`)
    if (notifElement) {
      notifElement.classList.add('deleting')
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }, 300)
    }
  };

  const handleBulkAction = (action) => {
    if (selectedNotifications.length === 0) {
      alert('Aucune notification sélectionnée')
      return
    }
    
    switch (action) {
      case 'markAsRead':
        setNotifications(prev => 
          prev.map(n => 
            selectedNotifications.includes(n.id) 
              ? { ...n, unread: false }
              : n
          )
        )
        console.log(`✅ ${selectedNotifications.length} notifications marquées comme lues`)
        break
        
      case 'delete':
        if (window.confirm(`Supprimer ${selectedNotifications.length} notifications ?`)) {
          setNotifications(prev => 
            prev.filter(n => !selectedNotifications.includes(n.id))
          )
          console.log(`🗑️ ${selectedNotifications.length} notifications supprimées`)
        }
        break
        
      default:
        break
    }
    
    setSelectedNotifications([])
    setShowBulkActions(false)
  }

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev => {
      const isSelected = prev.includes(notificationId)
      const newSelection = isSelected 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
      
      // Afficher/masquer les actions en lot
      setShowBulkActions(newSelection.length > 0)
      
      return newSelection
    })
  }

  const toggleSelectAll = () => {
    const allIds = sortedNotifications.map(n => n.id)
    const allSelected = allIds.every(id => selectedNotifications.includes(id))
    
    if (allSelected) {
      setSelectedNotifications([])
      setShowBulkActions(false)
    } else {
      setSelectedNotifications(allIds)
      setShowBulkActions(true)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const unreadCount = notifications.filter(n => n.unread).length
  const totalCount = notifications.length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="notifications-modal" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header du modal */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>📬 Centre de notifications</h2>
            <span className="notifications-summary">
              {unreadCount} non lues • {totalCount} total
              {filteredNotifications.length !== totalCount && (
                <span className="filter-indicator"> • {filteredNotifications.length} affichées</span>
              )}
            </span>
          </div>
          <button className="close-button" onClick={onClose} title="Fermer (Échap)">
            ✕
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="notifications-search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher dans les notifications..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch} title="Effacer la recherche">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Contrôles de filtre et tri */}
        <div className="notifications-controls">
          <div className="controls-left">
            <div className="filter-controls">
              <label>Filtrer:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Toutes ({totalCount})</option>
                <option value="unread">Non lues ({unreadCount})</option>
                <option value="read">Lues ({totalCount - unreadCount})</option>
              </select>
            </div>

            <div className="sort-controls">
              <label>Trier par:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Plus récentes</option>
                <option value="oldest">Plus anciennes</option>
                <option value="priority">Priorité</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>

          <div className="controls-right">
            {/* Sélection multiple */}
            <div className="selection-controls">
              <button 
                className="select-all-btn"
                onClick={toggleSelectAll}
                title="Sélectionner tout / Tout désélectionner"
              >
                {selectedNotifications.length === sortedNotifications.length && sortedNotifications.length > 0 
                  ? '☑️ Tout désélectionner' 
                  : '☐ Sélectionner tout'
                }
              </button>
            </div>

            <div className="action-controls">
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || isLoading}
                title="Marquer toutes les notifications comme lues"
              >
                {isLoading ? '⏳ Traitement...' : '📖 Tout marquer comme lu'}
              </button>
            </div>
          </div>
        </div>

        {/* Actions en lot */}
        {showBulkActions && (
          <div className="bulk-actions">
            <span className="bulk-info">
              {selectedNotifications.length} notification(s) sélectionnée(s)
            </span>
            <div className="bulk-buttons">
              <button 
                className="bulk-btn mark-read"
                onClick={() => handleBulkAction('markAsRead')}
              >
                📖 Marquer comme lues
              </button>
              <button 
                className="bulk-btn delete"
                onClick={() => handleBulkAction('delete')}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        )}

        {/* Liste des notifications */}
        <div className="notifications-content">
          {isLoading ? (
            <div className="loading-notifications">
              <div className="loading-spinner"></div>
              <p>Chargement des notifications...</p>
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-icon">
                {searchTerm ? '🔍' : filter === 'unread' ? '✅' : '📭'}
              </div>
              <h3>
                {searchTerm 
                  ? 'Aucun résultat trouvé'
                  : filter === 'unread' 
                  ? 'Toutes vos notifications ont été lues !'
                  : filter === 'read'
                  ? 'Aucune notification lue trouvée.'
                  : 'Vous n\'avez aucune notification pour le moment.'
                }
              </h3>
              <p>
                {searchTerm 
                  ? `Aucune notification ne correspond à "${searchTerm}"`
                  : filter === 'unread'
                  ? 'Bravo ! Vous êtes à jour avec toutes vos notifications.'
                  : filter === 'read'
                  ? 'Les notifications lues apparaîtront ici.'
                  : 'Les nouvelles notifications apparaîtront ici.'
                }
              </p>
              {searchTerm && (
                <button className="clear-search-btn" onClick={clearSearch}>
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="notifications-list">
              {sortedNotifications.map(notification => (
                <div 
                  key={notification.id}
                  data-notification-id={notification.id}
                  className={`notification-item ${notification.unread ? 'unread' : 'read'} ${getTypeClass(notification.type)} ${selectedNotifications.includes(notification.id) ? 'selected' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Checkbox de sélection */}
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleNotificationSelection(notification.id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="notification-indicator">
                    {notification.unread && <div className="unread-dot"></div>}
                  </div>
                  
                  <div className="notification-icon">
                    {notification.icon}
                  </div>
                  
                  <div className="notification-main">
                    <div className="notification-header-item">
                      <h4 className="notification-title">{notification.title}</h4>
                      <div className="notification-meta">
                        <span className={`notification-priority ${getPriorityClass(notification.priority)}`}>
                          {notification.priority === 'high' ? '🔴 Haute' : 
                           notification.priority === 'medium' ? '🟡 Moyenne' : 
                           '🟢 Faible'}
                        </span>
                        <span className="notification-time">{formatDate(notification.time)}</span>
                      </div>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    <div className="notification-footer">
                      {notification.relatedTicket && (
                        <div className="notification-ticket">
                          <span 
                            className="ticket-link"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onTicketClick) {
                                onTicketClick(notification.relatedTicket)
                                onClose()
                              }
                            }}
                          >
                            🎫 {notification.relatedTicket}
                          </span>
                        </div>
                      )}
                      
                      <div className="notification-metadata">
                        <span className="notification-category">
                          📁 {notification.category}
                        </span>
                        <span className="notification-sender">
                          👤 {notification.sender}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {notification.unread && (
                      <button 
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNotificationClick(notification)
                        }}
                        title="Marquer comme lu"
                      >
                        👁️
                      </button>
                    )}
                    <button 
                      className="delete-notification-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer du modal */}
        <div className="modal-footer">
          <div className="footer-left">
            <span className="notifications-info">
              📊 Notifications pour {user?.firstname} {user?.lastname}
              {selectedNotifications.length > 0 && (
                <span className="selection-count"> • {selectedNotifications.length} sélectionnée(s)</span>
              )}
            </span>
          </div>
          <div className="footer-right">
            <button className="refresh-btn" onClick={() => window.location.reload()} title="Actualiser">
              🔄 Actualiser
            </button>
            <button className="close-modal-btn" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
