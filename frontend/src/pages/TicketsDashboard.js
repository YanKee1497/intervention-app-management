import React, { useState, useEffect } from 'react';
import HeaderPro from '../components/HeaderPro';
import './TicketsDashboard.css';

function TicketsDashboard() {
  const [user] = useState({
    id: 1,
    email: 'admin@entreprise.com',
    nom: 'Administrateur',
    prenom: 'Admin',
    role: 'admin'
  });

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Données de démonstration
  const mockTickets = [
    {
      id: 'TCK-001',
      subject: 'Problème réseau bureau 204',
      category: 'Support',
      status: 'en_attente',
      createdAt: '2025-08-27',
      priority: 'normal'
    },
    {
      id: 'TCK-002',
      subject: 'Installation logiciel comptabilité',
      category: 'Installation',
      status: 'en_cours',
      createdAt: '2025-08-26',
      priority: 'urgent'
    },
    {
      id: 'TCK-003',
      subject: 'Bug application mobile',
      category: 'Bug',
      status: 'resolu',
      createdAt: '2025-08-25',
      priority: 'normal'
    },
    {
      id: 'TCK-004',
      subject: 'Demande accès serveur',
      category: 'Support',
      status: 'non_pris_en_charge',
      createdAt: '2025-08-24',
      priority: 'faible'
    },
    {
      id: 'TCK-005',
      subject: 'Écran qui clignote',
      category: 'Support',
      status: 'en_attente',
      createdAt: '2025-08-27',
      priority: 'urgent'
    },
    {
      id: 'TCK-006',
      subject: 'Configuration VPN',
      category: 'Installation',
      status: 'en_cours',
      createdAt: '2025-08-26',
      priority: 'normal'
    }
  ];

  useEffect(() => {
    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

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

    // Recherche par ID ou sujet
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [selectedStatus, selectedCategory, searchTerm, tickets]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handleStatusCardClick = (status) => {
    setSelectedStatus(selectedStatus === status ? 'all' : status);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLogout = () => {
    console.log('Déconnexion...');
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
        notifications={5}
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
              <div className="search-wrapper">
                <input 
                  type="text"
                  className="search-table"
                  placeholder="Rechercher dans le tableau..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

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
                      <button className="action-btn view-btn" title="Voir">👁</button>
                      <button className="action-btn restart-btn" title="Relancer">🔄</button>
                      <button className="action-btn cancel-btn" title="Annuler">🗑</button>
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
    </div>
  );
}

export default TicketsDashboard;
