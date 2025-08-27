import React, { useState, useEffect } from 'react';
import HeaderPro from '../components/HeaderPro';
import NewTicketModal from '../components/NewTicketModal';
import TicketDetailsModal from '../components/TicketDetailsModal';
import './TicketsDashboard.css';

function TicketsDashboard() {
  const [user] = useState({
    id: 1,
    email: 'admin@entreprise.com',
    nom: 'Administrateur',
    prenom: 'Admin',
    role: 'admin',
    service: 'Direction générale'
  });

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isTicketDetailsModalOpen, setIsTicketDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Données de démonstration
  const mockTickets = [
    {
      id: 'TCK-001',
      subject: 'Problème réseau bureau 204',
      category: 'Support',
      status: 'en_attente',
      createdAt: '2025-08-27',
      priority: 'normal',
      description: 'Le réseau est instable dans le bureau 204. Les connexions se coupent régulièrement et la vitesse est très lente.'
    },
    {
      id: 'TCK-002',
      subject: 'Installation logiciel comptabilité',
      category: 'Installation',
      status: 'en_cours',
      createdAt: '2025-08-26',
      priority: 'urgent',
      description: 'Besoin d\'installer le logiciel de comptabilité SAP sur 5 postes du service comptabilité.'
    },
    {
      id: 'TCK-003',
      subject: 'Bug application mobile',
      category: 'Bug',
      status: 'resolu',
      createdAt: '2025-08-25',
      priority: 'normal',
      description: 'L\'application mobile plante au démarrage sur les appareils Android version 12+'
    },
    {
      id: 'TCK-004',
      subject: 'Demande accès serveur',
      category: 'Support',
      status: 'non_pris_en_charge',
      createdAt: '2025-08-24',
      priority: 'faible',
      description: 'Demande d\'accès au serveur de fichiers partagés pour le nouvel employé.'
    },
    {
      id: 'TCK-005',
      subject: 'Écran qui clignote',
      category: 'Support',
      status: 'en_attente',
      createdAt: '2025-08-27',
      priority: 'urgent',
      description: 'L\'écran principal clignote constamment, impossible de travailler correctement.'
    },
    {
      id: 'TCK-006',
      subject: 'Configuration VPN',
      category: 'Installation',
      status: 'en_cours',
      createdAt: '2025-08-26',
      priority: 'normal',
      description: 'Configuration du VPN pour permettre le télétravail sécurisé.'
    }
  ];

  useEffect(() => {
    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + N : Nouveau ticket
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewTicketClick();
      }
      // Escape : Fermer les modales
      if (e.key === 'Escape') {
        if (isNewTicketModalOpen) {
          setIsNewTicketModalOpen(false);
        }
        if (isTicketDetailsModalOpen) {
          handleCloseTicketDetails();
        }
      }
      // Ctrl/Cmd + F : Focus sur la recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        // Envoyer un événement pour focus sur la recherche du header
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Ctrl/Cmd + R : Actualiser les données
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        console.log('Actualisation des données...');
        alert('Données actualisées !');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNewTicketModalOpen, isTicketDetailsModalOpen]);

  // Calcul des statistiques
  const getStats = () => {
    return {
      en_attente: tickets.filter(t => t.status === 'en_attente').length,
      en_cours: tickets.filter(t => t.status === 'en_cours').length,
      resolu: tickets.filter(t => t.status === 'resolu').length,
      non_pris_en_charge: tickets.filter(t => t.status === 'non_pris_en_charge').length
    };
  };

  // Filtrage des tickets
  useEffect(() => {
    let filtered = tickets;

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.category.toLowerCase().includes(searchLower) ||
        ticket.status.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [selectedStatus, selectedCategory, searchTerm, tickets]);

  // Fonction de gestion de la recherche depuis le header
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handleStatusCardClick = (status) => {
    setSelectedStatus(selectedStatus === status ? 'all' : status);
  };

  const handleNewTicketClick = () => {
    setIsNewTicketModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewTicketModalOpen(false);
  };

  const handleLogout = () => {
    console.log('Déconnexion...');
  };

  // Handlers pour les actions sur les tickets
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailsModalOpen(true);
  };

  const handleRestartTicket = (ticket) => {
    if (window.confirm(`Êtes-vous sûr de vouloir relancer le ticket ${ticket.id} ?`)) {
      // Mise à jour du statut du ticket
      const updatedTickets = tickets.map(t => 
        t.id === ticket.id 
          ? { ...t, status: 'en_attente', createdAt: new Date().toISOString().split('T')[0] }
          : t
      );
      setTickets(updatedTickets);
      alert(`Le ticket ${ticket.id} a été relancé avec succès !`);
    }
  };

  const handleDeleteTicket = (ticket) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le ticket ${ticket.id} ?\n\nCette action est irréversible.`)) {
      const updatedTickets = tickets.filter(t => t.id !== ticket.id);
      setTickets(updatedTickets);
      alert(`Le ticket ${ticket.id} a été supprimé avec succès !`);
    }
  };

  const handleCloseTicketDetails = () => {
    setIsTicketDetailsModalOpen(false);
    setSelectedTicket(null);
  };

  const getStatusText = (status) => {
    const statusMap = {
      en_attente: 'En attente',
      en_cours: 'En cours',
      resolu: 'Résolus',
      non_pris_en_charge: 'Non pris en charge'
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge status-${status.replace('_', '-')}`;
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'Support': 'Support',
      'Bug': 'Bug',
      'Installation': 'Installation'
    };
    return categoryMap[category] || category;
  };

  const stats = getStats();

  return (
    <div className="tickets-dashboard">
      {/* Header */}
      <HeaderPro 
        user={user}
        notifications={2} // Nombre de notifications non lues
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Titre et fil d'Ariane */}
          <div className="page-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="breadcrumb-item current">Tickets</span>
            </div>
            <h1 className="page-title">Mes Tickets</h1>
          </div>

          {/* Cards de statuts */}
          <div className="status-cards">
            <div 
              className={`status-card status-en-attente ${selectedStatus === 'en_attente' ? 'active' : ''}`}
              onClick={() => handleStatusCardClick('en_attente')}
            >
              <div className="card-icon">🟠</div>
              <div className="card-content">
                <div className="card-number">{stats.en_attente}</div>
                <div className="card-label">En attente</div>
              </div>
            </div>

            <div 
              className={`status-card status-en-cours ${selectedStatus === 'en_cours' ? 'active' : ''}`}
              onClick={() => handleStatusCardClick('en_cours')}
            >
              <div className="card-icon">🔵</div>
              <div className="card-content">
                <div className="card-number">{stats.en_cours}</div>
                <div className="card-label">En cours</div>
              </div>
            </div>

            <div 
              className={`status-card status-resolu ${selectedStatus === 'resolu' ? 'active' : ''}`}
              onClick={() => handleStatusCardClick('resolu')}
            >
              <div className="card-icon">✅</div>
              <div className="card-content">
                <div className="card-number">{stats.resolu}</div>
                <div className="card-label">Résolus</div>
              </div>
            </div>

            <div 
              className={`status-card status-non-pris-en-charge ${selectedStatus === 'non_pris_en_charge' ? 'active' : ''}`}
              onClick={() => handleStatusCardClick('non_pris_en_charge')}
            >
              <div className="card-icon">⚪</div>
              <div className="card-content">
                <div className="card-number">{stats.non_pris_en_charge}</div>
                <div className="card-label">Non pris en charge</div>
              </div>
            </div>
          </div>

          {/* Zone de filtres */}
          <div className="filters-section">
            <div className="filters-left">
              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories ▼</option>
                <option value="Support">Support</option>
                <option value="Bug">Bug</option>
                <option value="Installation">Installation</option>
              </select>

              <select 
                className="entries-select"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="filters-right">
              <button 
                className="new-request-btn"
                onClick={handleNewTicketClick}
              >
                + Nouvelle demande
              </button>
            </div>
          </div>

          {/* Indicateur de recherche */}
          {searchTerm && (
            <div className="search-indicator">
              <span className="search-info">
                🔍 Recherche pour "<strong>{searchTerm}</strong>" 
                - {filteredTickets.length} résultat(s) trouvé(s)
              </span>
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                title="Effacer la recherche"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tableau des tickets */}
          <div className="table-container">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Sujet</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket, index) => (
                  <tr key={ticket.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td className="ticket-id">{ticket.id}</td>
                    <td className="subject">{ticket.subject}</td>
                    <td className="category">{getCategoryText(ticket.category)}</td>
                    <td>
                      <span className={getStatusBadgeClass(ticket.status)}>
                        {getStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="date">{ticket.createdAt}</td>
                    <td className="actions">
                      <button 
                        className="action-btn view-btn" 
                        title="Voir les détails"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        👁
                      </button>
                      <button 
                        className="action-btn restart-btn" 
                        title="Relancer le ticket"
                        onClick={() => handleRestartTicket(ticket)}
                      >
                        🔄
                      </button>
                      <button 
                        className="action-btn cancel-btn" 
                        title="Supprimer le ticket"
                        onClick={() => handleDeleteTicket(ticket)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTickets.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-title">Aucun ticket trouvé</div>
                <div className="empty-description">
                  Aucun ticket ne correspond à vos critères de recherche.
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FAB (Floating Action Button) for Mobile */}
      <button 
        className="fab-btn"
        onClick={handleNewTicketClick}
        title="Nouvelle demande (Ctrl+N)"
      >
        +
      </button>

      {/* Raccourcis clavier - Aide */}
      <div className="keyboard-shortcuts-hint">
        <span className="shortcuts-text">
          💡 <strong>Ctrl+N</strong> Nouveau ticket • <strong>Ctrl+F</strong> Rechercher • <strong>Esc</strong> Fermer
        </span>
      </div>

      {/* Modale Nouvelle demande */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={handleCloseModal}
        user={user}
      />

      {/* Modale Détails du ticket */}
      <TicketDetailsModal
        isOpen={isTicketDetailsModalOpen}
        onClose={handleCloseTicketDetails}
        ticket={selectedTicket}
      />
    </div>
  );
}

export default TicketsDashboard;
