import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './TechnicianEmployeeStyleDashboard.css';

const TechnicianEmployeeStyleDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous les statuts');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0
  });

  // Données simulées - tickets pour technicien
  const mockTickets = [
    {
      id: 'TCK-001',
      title: 'Problème réseau bureau 204',
      category: 'technique',
      status: 'OUVERT',
      priority: 'high',
      employee: { firstname: 'Marie', lastname: 'Dupont' },
      service: { name: 'Informatique' },
      created_at: '2024-03-15',
      description: 'Connexion réseau instable, perte de connexion fréquente'
    },
    {
      id: 'TCK-002',
      title: 'Demande accès logiciel comptabilité',
      category: 'accès',
      status: 'EN COURS',
      priority: 'medium',
      employee: { firstname: 'Pierre', lastname: 'Martin' },
      service: { name: 'Comptabilité' },
      created_at: '2024-03-14',
      description: 'Nouvel employé nécessite accès au logiciel de comptabilité'
    },
    {
      id: 'TCK-003',
      title: 'Maintenance serveur principal',
      category: 'maintenance',
      status: 'RÉSOLU',
      priority: 'high',
      employee: { firstname: 'Sophie', lastname: 'Chen' },
      service: { name: 'Informatique' },
      created_at: '2024-03-10',
      description: 'Maintenance préventive du serveur principal terminée'
    },
    {
      id: 'TCK-004',
      title: 'Formation utilisateurs Office 365',
      category: 'formation',
      status: 'OUVERT',
      priority: 'low',
      employee: { firstname: 'Alex', lastname: 'Bernard' },
      service: { name: 'Formation' },
      created_at: '2024-03-12',
      description: 'Formation sur les nouvelles fonctionnalités Office 365'
    },
    {
      id: 'TCK-005',
      title: 'Installation poste de travail',
      category: 'matériel',
      status: 'EN COURS',
      priority: 'medium',
      employee: { firstname: 'Claire', lastname: 'Dubois' },
      service: { name: 'Informatique' },
      created_at: '2024-03-13',
      description: 'Installation complète nouveau poste de travail'
    },
    {
      id: 'TCK-006',
      title: 'Sauvegarde données projet X',
      category: 'sauvegarde',
      status: 'OUVERT',
      priority: 'urgent',
      employee: { firstname: 'Thomas', lastname: 'Rousseau' },
      service: { name: 'Informatique' },
      created_at: '2024-03-16',
      description: 'Sauvegarde critique des données du projet X'
    },
    {
      id: 'TCK-007',
      title: 'Réparation imprimante 3ème étage',
      category: 'matériel',
      status: 'FERMÉ',
      priority: 'medium',
      employee: { firstname: 'Emma', lastname: 'Leroy' },
      service: { name: 'Maintenance' },
      created_at: '2024-03-11',
      description: 'Réparation de l\'imprimante multifonction du 3ème étage'
    },
    {
      id: 'TCK-008',
      title: 'Configuration VPN télétravail',
      category: 'réseau',
      status: 'EN COURS',
      priority: 'medium',
      employee: { firstname: 'Lucas', lastname: 'Moreau' },
      service: { name: 'Informatique' },
      created_at: '2024-03-09',
      description: 'Configuration accès VPN pour télétravail'
    }
  ];

  useEffect(() => {
    // Simulation du chargement
    setTickets(mockTickets);
    
    // Calcul des statistiques
    const newStats = {
      pending: mockTickets.filter(t => t.status === 'OUVERT').length,
      assigned: mockTickets.filter(t => t.status === 'EN COURS').length,
      resolved: mockTickets.filter(t => t.status === 'RÉSOLU').length,
      closed: mockTickets.filter(t => t.status === 'FERMÉ').length
    };
    setStats(newStats);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'OUVERT': return 'status-open';
      case 'EN COURS': return 'status-in-progress';
      case 'RÉSOLU': return 'status-resolved';
      case 'FERMÉ': return 'status-closed';
      default: return 'status-default';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  const handleTicketAction = (ticketId, action) => {
    console.log(`Action ${action} sur ticket ${ticketId}`);
    // Ici on implémenterait les actions (prendre en charge, résoudre, etc.)
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes les catégories' || 
                           ticket.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="technician-employee-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⚙️</span>
            <span className="logo-text">GT System</span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="chercher tickets, utilisateurs, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
        </div>
        
        <div className="header-right">
          <div className="notifications">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
          </div>
          <div className="user-profile">
            <span className="user-name">Technicien {user?.firstname || 'Durand'}</span>
            <span className="user-role">technicien</span>
            <div className="user-avatar">FR</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card pending">
            <div className="stat-icon">🟠</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>
          
          <div className="stat-card in-progress">
            <div className="stat-icon">🔵</div>
            <div className="stat-content">
              <div className="stat-number">{stats.assigned}</div>
              <div className="stat-label">En cours</div>
            </div>
          </div>
          
          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Résolus</div>
            </div>
          </div>
          
          <div className="stat-card closed">
            <div className="stat-icon">⚪</div>
            <div className="stat-content">
              <div className="stat-number">{stats.closed}</div>
              <div className="stat-label">Fermés</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="controls-container">
          <div className="filters">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option>Toutes les catégories</option>
              <option value="technique">technique</option>
              <option value="accès">accès</option>
              <option value="maintenance">maintenance</option>
              <option value="formation">formation</option>
              <option value="matériel">matériel</option>
              <option value="sauvegarde">sauvegarde</option>
              <option value="réseau">réseau</option>
            </select>
            
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="items-per-page"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <button className="new-ticket-btn">+ Nouvelle intervention</button>
        </div>

        {/* Tickets Table */}
        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>TICKET ID</th>
                <th>SUJET</th>
                <th>CATÉGORIE</th>
                <th>STATUT</th>
                <th>DATE DE CRÉATION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-id">{ticket.id}</td>
                  <td className="ticket-subject">{ticket.title}</td>
                  <td className="ticket-category">
                    <span className="category-badge">{ticket.category}</span>
                  </td>
                  <td className="ticket-status">
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="ticket-date">{ticket.created_at}</td>
                  <td className="ticket-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleTicketAction(ticket.id, 'view')}
                      title="Voir détails"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleTicketAction(ticket.id, 'edit')}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleTicketAction(ticket.id, 'delete')}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Controls */}
        <div className="footer-controls">
          <div className="keyboard-shortcuts">
            <span>⌘ Ctrl+N</span>
            <span>Nouveau ticket • </span>
            <span>⌘ Ctrl+F</span>
            <span>Rechercher • </span>
            <span>⌘ Esc</span>
            <span>Fermer</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechnicianEmployeeStyleDashboard;
