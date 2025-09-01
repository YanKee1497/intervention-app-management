import React, { useState, useEffect } from 'react';
import './AdminOverview.css';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTickets: 0,
    pendingTickets: 0,
    resolvedToday: 0,
    systemHealth: 98
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Simulation de données du dashboard
    setStats({
      totalUsers: 127,
      activeUsers: 89,
      totalTickets: 1543,
      pendingTickets: 23,
      resolvedToday: 47,
      systemHealth: 98
    });

    setRecentActivity([
      {
        id: 1,
        type: 'user_created',
        message: 'Nouvel utilisateur : Marie Dupont (Technicien)',
        time: '5 min',
        icon: 'fas fa-user-plus',
        color: 'success'
      },
      {
        id: 2,
        type: 'ticket_resolved',
        message: '3 tickets résolus par Jean Martin',
        time: '12 min',
        icon: 'fas fa-check-circle',
        color: 'success'
      },
      {
        id: 3,
        type: 'system_alert',
        message: 'Alerte : Pic d\'utilisation CPU (85%)',
        time: '25 min',
        icon: 'fas fa-exclamation-triangle',
        color: 'warning'
      },
      {
        id: 4,
        type: 'backup_completed',
        message: 'Sauvegarde automatique terminée',
        time: '1h',
        icon: 'fas fa-database',
        color: 'info'
      },
      {
        id: 5,
        type: 'user_login',
        message: '15 connexions utilisateurs dans la dernière heure',
        time: '1h',
        icon: 'fas fa-sign-in-alt',
        color: 'info'
      }
    ]);

    setQuickActions([
      {
        id: 'create_user',
        title: 'Créer un utilisateur',
        description: 'Ajouter un nouveau compte',
        icon: 'fas fa-user-plus',
        color: 'primary'
      },
      {
        id: 'system_backup',
        title: 'Sauvegarde manuelle',
        description: 'Lancer une sauvegarde',
        icon: 'fas fa-download',
        color: 'info'
      },
      {
        id: 'view_logs',
        title: 'Consulter les logs',
        description: 'Journaux système',
        icon: 'fas fa-file-alt',
        color: 'secondary'
      },
      {
        id: 'maintenance_mode',
        title: 'Mode maintenance',
        description: 'Activer/désactiver',
        icon: 'fas fa-tools',
        color: 'warning'
      }
    ]);
  };

  const StatCard = ({ title, value, icon, change, trend }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {change && (
          <div className={`stat-change ${trend}`}>
            <i className={`fas fa-arrow-${trend === 'up' ? 'up' : 'down'}`}></i>
            {change}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-overview">
      <div className="overview-header">
        <h1>Vue d'ensemble de l'administration</h1>
        <p>Tableau de bord principal - Gestion du système GT</p>
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <StatCard
          title="Utilisateurs totaux"
          value={stats.totalUsers}
          icon="fas fa-users"
          change="+12%"
          trend="up"
        />
        <StatCard
          title="Utilisateurs actifs"
          value={stats.activeUsers}
          icon="fas fa-user-check"
          change="+5%"
          trend="up"
        />
        <StatCard
          title="Tickets totaux"
          value={stats.totalTickets}
          icon="fas fa-ticket-alt"
          change="+8%"
          trend="up"
        />
        <StatCard
          title="Tickets en attente"
          value={stats.pendingTickets}
          icon="fas fa-clock"
          change="-15%"
          trend="down"
        />
        <StatCard
          title="Résolus aujourd'hui"
          value={stats.resolvedToday}
          icon="fas fa-check-circle"
          change="+23%"
          trend="up"
        />
        <StatCard
          title="Santé du système"
          value={`${stats.systemHealth}%`}
          icon="fas fa-heartbeat"
          change="+2%"
          trend="up"
        />
      </div>

      <div className="overview-content">
        {/* Actions rapides */}
        <div className="quick-actions-section">
          <h2>Actions rapides</h2>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <button key={action.id} className={`quick-action-card ${action.color}`}>
                <div className="action-icon">
                  <i className={action.icon}></i>
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="recent-activity-section">
          <h2>Activité récente</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.color}`}>
                <div className="activity-icon">
                  <i className={activity.icon}></i>
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">il y a {activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-activity">
            Voir toute l'activité
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Graphiques et métriques */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Utilisation du système</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <i className="fas fa-chart-line"></i>
                <p>Graphique d'utilisation sur 24h</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Répartition des tickets</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <i className="fas fa-chart-pie"></i>
                <p>Répartition par statut</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <h3>Performance des techniciens</h3>
            <div className="metric-chart">
              <div className="chart-placeholder">
                <i className="fas fa-chart-bar"></i>
                <p>Tickets résolus par technicien</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
