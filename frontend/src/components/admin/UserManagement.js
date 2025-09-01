import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const loadUsers = () => {
    // Simulation de données utilisateurs
    const mockUsers = [
      {
        id: 1,
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@company.com',
        role: 'technician',
        status: 'active',
        lastLogin: '2024-03-15T14:30:00Z',
        createdAt: '2024-01-15T09:00:00Z',
        ticketsAssigned: 12,
        ticketsResolved: 45
      },
      {
        id: 2,
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@company.com',
        role: 'employee',
        status: 'active',
        lastLogin: '2024-03-15T12:15:00Z',
        createdAt: '2024-02-01T10:30:00Z',
        ticketsCreated: 8
      },
      {
        id: 3,
        nom: 'Chen',
        prenom: 'Sophie',
        email: 'sophie.chen@company.com',
        role: 'technician',
        status: 'inactive',
        lastLogin: '2024-03-10T16:45:00Z',
        createdAt: '2024-01-20T14:00:00Z',
        ticketsAssigned: 0,
        ticketsResolved: 23
      },
      {
        id: 4,
        nom: 'Bernard',
        prenom: 'Alex',
        email: 'alex.bernard@company.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-03-15T11:00:00Z',
        createdAt: '2024-01-10T08:30:00Z'
      },
      {
        id: 5,
        nom: 'Rousseau',
        prenom: 'Thomas',
        email: 'thomas.rousseau@company.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-15T15:20:00Z',
        createdAt: '2024-01-05T09:00:00Z'
      }
    ];
    setUsers(mockUsers);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: 'Administrateur', class: 'admin' },
      manager: { label: 'Gestionnaire', class: 'manager' },
      technician: { label: 'Technicien', class: 'technician' },
      employee: { label: 'Employé', class: 'employee' }
    };
    
    const config = roleConfig[role] || { label: role, class: 'default' };
    return <span className={`role-badge ${config.class}`}>{config.label}</span>;
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status}`}>
        {status === 'active' ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUserAction = (action, userId) => {
    console.log(`Action ${action} sur l'utilisateur ${userId}`);
    // Ici on implémenterait les actions réelles
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="header-left">
          <h1>Gestion des utilisateurs</h1>
          <p>Administration des comptes et permissions</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-user-plus"></i>
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        <div className="filter-container">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="manager">Gestionnaires</option>
            <option value="technician">Techniciens</option>
            <option value="employee">Employés</option>
          </select>
        </div>

        <div className="results-info">
          {filteredUsers.length} utilisateur(s) trouvé(s)
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th>Statistiques</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="user-row">
                <td className="user-info">
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="user-details">
                    <h3>{user.prenom} {user.nom}</h3>
                    <p>{user.email}</p>
                    <small>Créé le {formatDate(user.createdAt)}</small>
                  </div>
                </td>

                <td className="user-role">
                  {getRoleBadge(user.role)}
                </td>

                <td className="user-status">
                  {getStatusBadge(user.status)}
                </td>

                <td className="user-login">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais connecté'}
                </td>

                <td className="user-stats">
                  {user.role === 'technician' && (
                    <div className="tech-stats">
                      <div className="stat-item">
                        <i className="fas fa-tasks"></i>
                        <span>{user.ticketsAssigned || 0} assignés</span>
                      </div>
                      <div className="stat-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{user.ticketsResolved || 0} résolus</span>
                      </div>
                    </div>
                  )}
                  {user.role === 'employee' && user.ticketsCreated && (
                    <div className="employee-stats">
                      <div className="stat-item">
                        <i className="fas fa-plus-circle"></i>
                        <span>{user.ticketsCreated} créés</span>
                      </div>
                    </div>
                  )}
                </td>

                <td className="user-actions">
                  <div className="action-buttons">
                    <button
                      className="btn-action edit"
                      onClick={() => setSelectedUser(user)}
                      title="Modifier"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-action toggle"
                      onClick={() => handleUserAction('toggle', user.id)}
                      title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                    >
                      <i className={`fas fa-${user.status === 'active' ? 'user-slash' : 'user-check'}`}></i>
                    </button>
                    <button
                      className="btn-action reset-password"
                      onClick={() => handleUserAction('resetPassword', user.id)}
                      title="Réinitialiser le mot de passe"
                    >
                      <i className="fas fa-key"></i>
                    </button>
                    <button
                      className="btn-action delete"
                      onClick={() => handleUserAction('delete', user.id)}
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-users">
            <i className="fas fa-users"></i>
            <h3>Aucun utilisateur trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Stats rapides */}
      <div className="user-stats-summary">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div>
            <h3>{users.length}</h3>
            <p>Utilisateurs totaux</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-user-check"></i>
          <div>
            <h3>{users.filter(u => u.status === 'active').length}</h3>
            <p>Utilisateurs actifs</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-user-cog"></i>
          <div>
            <h3>{users.filter(u => u.role === 'technician').length}</h3>
            <p>Techniciens</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-user-shield"></i>
          <div>
            <h3>{users.filter(u => u.role === 'admin').length}</h3>
            <p>Administrateurs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
