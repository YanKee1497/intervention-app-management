import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

// Contexte d'authentification simplifié
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Composant de connexion simplifié
function SimpleLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      maxWidth: '400px', 
      margin: '0 auto',
      marginTop: '100px'
    }}>
      <h1>🔐 Connexion</h1>
      
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email :</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@entreprise.com"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Mot de passe :</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
            required
          />
        </div>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>Comptes de test :</strong><br/>
        admin@entreprise.com / password123<br/>
        manager@entreprise.com / password123<br/>
        employe1@entreprise.com / password123
      </div>
    </div>
  );
}

// Dashboard pour employé
function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    enAttente: 0,
    enCours: 0,
    resolus: 0
  });
  const [notifications, setNotifications] = useState(3); // Simulation
  const [showNewTicket, setShowNewTicket] = useState(false);

  // Simulation de données de tickets
  const mockTickets = [
    { id: 1, title: "Problème imprimante bureau 204", status: "en_attente", date: "2025-08-25", priority: "normal" },
    { id: 2, title: "Écran qui clignote", status: "en_cours", date: "2025-08-24", priority: "urgent" },
    { id: 3, title: "Souris défectueuse", status: "resolu", date: "2025-08-23", priority: "faible" },
    { id: 4, title: "Connexion WiFi instable", status: "en_attente", date: "2025-08-25", priority: "normal" }
  ];

  React.useEffect(() => {
    setTickets(mockTickets);
    // Calculer les statistiques
    const stats = mockTickets.reduce((acc, ticket) => {
      if (ticket.status === 'en_attente') acc.enAttente++;
      else if (ticket.status === 'en_cours') acc.enCours++;
      else if (ticket.status === 'resolu') acc.resolus++;
      return acc;
    }, { enAttente: 0, enCours: 0, resolus: 0 });
    setStats(stats);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'linear-gradient(135deg, #ffeaa7, #fdcb6e)';
      case 'en_cours': return 'linear-gradient(135deg, #74b9ff, #0984e3)';
      case 'resolu': return 'linear-gradient(135deg, #55efc4, #00b894)';
      default: return 'linear-gradient(135deg, #ddd, #999)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'resolu': return 'Résolu';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#e17055';
      case 'normal': return '#74b9ff';
      case 'faible': return '#00b894';
      default: return '#636e72';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Container principal */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          padding: '25px 30px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#2d3436',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              🎯 Mes Demandes d'Intervention
            </h1>
            <p style={{ 
              margin: '8px 0 0 0', 
              color: '#636e72',
              fontSize: '16px'
            }}>
              Bienvenue, {user?.firstname || user?.email?.split('@')[0]} • {user?.role}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Notifications */}
            <div style={{ 
              position: 'relative', 
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(116, 185, 255, 0.1)'
            }}>
              <span style={{ fontSize: '28px' }}>🔔</span>
              {notifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  backgroundColor: '#e17055',
                  color: 'white',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(225, 112, 85, 0.3)'
                }}>
                  {notifications}
                </span>
              )}
            </div>
            
            {/* Bouton Nouvelle demande */}
            <button 
              onClick={() => setShowNewTicket(true)}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #00b894, #55efc4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: '0 8px 20px rgba(0, 184, 148, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              ➕ Nouvelle demande
            </button>
            
            <button 
              onClick={logout}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #e17055, #d63031)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 8px 20px rgba(225, 112, 85, 0.3)'
              }}
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Statistiques */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            padding: '30px', 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: getStatusColor('en_attente'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '36px'
            }}>
              ⏳
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fdcb6e', marginBottom: '10px' }}>
              {stats.enAttente}
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#2d3436', fontSize: '20px' }}>En attente</h3>
            <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>Demandes en cours de traitement</p>
          </div>
          
          <div style={{ 
            padding: '30px', 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: getStatusColor('en_cours'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '36px'
            }}>
              🔧
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#74b9ff', marginBottom: '10px' }}>
              {stats.enCours}
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#2d3436', fontSize: '20px' }}>En cours</h3>
            <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>Assignées à un technicien</p>
          </div>
          
          <div style={{ 
            padding: '30px', 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: getStatusColor('resolu'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '36px'
            }}>
              ✅
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#00b894', marginBottom: '10px' }}>
              {stats.resolus}
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#2d3436', fontSize: '20px' }}>Résolues</h3>
            <p style={{ margin: 0, color: '#636e72', fontSize: '14px' }}>Demandes terminées</p>
          </div>
        </div>

        {/* Section des tickets récents */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{ margin: 0, color: '#2d3436', fontSize: '24px', fontWeight: '700' }}>
              📋 Mes Tickets Récents
            </h2>
            <button 
              onClick={() => setShowNewTicket(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #00b894, #55efc4)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)'
              }}
            >
              ➕ Nouvelle demande
            </button>
          </div>

          {/* Liste des tickets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tickets.map(ticket => (
              <div key={ticket.id} style={{
                padding: '25px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#2d3436', fontSize: '18px', fontWeight: '600' }}>
                    {ticket.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{
                      padding: '6px 16px',
                      borderRadius: '25px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getStatusColor(ticket.status),
                      color: 'white',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                    }}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: getPriorityColor(ticket.priority),
                      backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                      border: `1px solid ${getPriorityColor(ticket.priority)}40`
                    }}>
                      {ticket.priority}
                    </span>
                    <span style={{ fontSize: '14px', color: '#636e72', fontWeight: '500' }}>
                      📅 {ticket.date}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 3px 10px rgba(116, 185, 255, 0.3)'
                  }}>
                    👁️ Voir
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 3px 10px rgba(162, 155, 254, 0.3)'
                  }}>
                    ✏️ Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal pour nouvelle demande */}
      {showNewTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '35px',
            borderRadius: '20px',
            width: '550px',
            maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 25px 0', color: '#2d3436', fontSize: '24px', fontWeight: '700' }}>
              ➕ Nouvelle Demande d'Intervention
            </h3>
            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3436' }}>
                  Titre de la demande *
                </label>
                <input 
                  type="text"
                  placeholder="Ex: Problème d'imprimante bureau 204"
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    border: '1px solid rgba(99, 110, 114, 0.3)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3436' }}>
                  Priorité *
                </label>
                <select style={{ 
                  width: '100%', 
                  padding: '15px', 
                  border: '1px solid rgba(99, 110, 114, 0.3)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  outline: 'none'
                }}>
                  <option value="faible">🟢 Faible</option>
                  <option value="normal">🟡 Normal</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3436' }}>
                  Description détaillée *
                </label>
                <textarea 
                  rows="4"
                  placeholder="Décrivez le problème en détail..."
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    border: '1px solid rgba(99, 110, 114, 0.3)',
                    borderRadius: '12px',
                    resize: 'vertical',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #ddd, #999)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #00b894, #55efc4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: '0 8px 20px rgba(0, 184, 148, 0.3)'
                  }}
                >
                  Créer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Route protégée
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <SimpleLogin />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
