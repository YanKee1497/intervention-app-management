import './App.css';
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';

// Contexte d'authentification
const AuthContext = createContext();

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Composant de connexion simplifié (mode local)
function SimpleLogin() {
  const [email, setEmail] = useState('admin@entreprise.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  console.log('🔍 SimpleLogin rendered - login function:', typeof login, 'loading:', loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔴 Bouton cliqué - handleSubmit called with:', { email, password: '***' });
    setError('');
    
    // Mode local - connexion simple
    if (email && password) {
      try {
        console.log('🚀 Tentative de connexion avec:', email);
        const result = await login(email, password);
        console.log('✅ Connexion réussie ! Résultat:', result);
        console.log('🚀 Redirection vers le dashboard...');
        navigate('/');
      } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error);
        setError('Erreur de connexion. Vérifiez vos identifiants.');
      }
    } else {
      setError('Veuillez saisir un email et un mot de passe.');
    }
  };

  const handleTestLogin = () => {
    console.log('🧪 Test de connexion directe');
    setEmail('admin@entreprise.com');
    setPassword('password123');
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '20px',
        width: '400px',
        maxWidth: '90vw',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#2d3436', fontSize: '24px' }}>
            🔒 Connexion
          </h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3436' }}>
              Email :
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="employe1@entreprise.com"
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3436' }}>
              Mot de passe :
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="••••••••••"
              required
            />
          </div>
          
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            onClick={() => console.log('🔴 Bouton cliqué!')}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #0984e3, #74b9ff)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        {/* Bouton de test pour diagnostiquer */}
        <button
          onClick={handleTestLogin}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, #00b894, #55efc4)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🧪 Test de connexion automatique
        </button>
        
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#636e72' }}>
          <strong>Comptes de test :</strong><br/>
          admin@entreprise.com / password123<br/>
          manager@entreprise.com / password123<br/>
          technicien1@entreprise.com / password123<br/>
          technicien2@entreprise.com / password123<br/>
          employe1@entreprise.com / password123<br/>
          employe2@entreprise.com / password123
        </div>
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
  const [showNewTicket, setShowNewTicket] = useState(false);

  React.useEffect(() => {
    const mockTickets = [
      { id: 1, title: "Problème imprimante bureau 204", status: "en_attente", date: "2025-08-25", priority: "normal" },
      { id: 2, title: "Écran qui clignote", status: "en_cours", date: "2025-08-24", priority: "urgent" },
      { id: 3, title: "Souris défectueuse", status: "resolu", date: "2025-08-23", priority: "faible" },
      { id: 4, title: "Connexion WiFi instable", status: "en_attente", date: "2025-08-25", priority: "normal" }
    ];
    
    setTickets(mockTickets);
    const statsCalculated = mockTickets.reduce((acc, ticket) => {
      if (ticket.status === 'en_attente') acc.enAttente++;
      else if (ticket.status === 'en_cours') acc.enCours++;
      else if (ticket.status === 'resolu') acc.resolus++;
      return acc;
    }, { enAttente: 0, enCours: 0, resolus: 0 });
    setStats(statsCalculated);
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
    <div>
      {/* Header avec fonctionnalités complètes */}
      <Header user={user} notifications={3} onLogout={logout} />
      
      {/* Contenu principal avec marge pour le header fixe */}
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '90px 20px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Section titre et bouton nouvelle demande */}
          <div style={{ 
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
                📋 Mes Demandes d'Intervention
              </h1>
              <p style={{ 
                margin: '8px 0 0 0', 
                color: '#636e72',
                fontSize: '16px'
              }}>
                Bienvenue, {user?.firstname || user?.name || user?.email?.split('@')[0]} • {user?.role || 'Employé'}
              </p>
            </div>
            
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
          </div>

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
    </div>
  );
}

// Route protégée
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// Fournisseur de contexte d'authentification
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    console.log('🔄 MODE LOCAL - Connexion avec:', { email, password: '***' });
    
    try {
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données utilisateur en dur selon l'email
      let userData;
      if (email.includes('admin')) {
        userData = {
          id: 1,
          email: email,
          nom: 'Administrateur',
          prenom: 'Admin',
          role: 'admin'
        };
      } else if (email.includes('manager')) {
        userData = {
          id: 2,
          email: email,
          nom: 'Dupont',
          prenom: 'Manager',
          role: 'manager'
        };
      } else if (email.includes('technicien')) {
        userData = {
          id: 3,
          email: email,
          nom: 'Martin',
          prenom: 'Technicien',
          role: 'technician'
        };
      } else {
        userData = {
          id: 4,
          email: email,
          nom: 'Durand',
          prenom: 'Employé',
          role: 'employee'
        };
      }
      
      console.log('✅ MODE LOCAL - Connexion réussie:', userData);
      
      setUser(userData);
      localStorage.setItem('token', 'mock-token-' + Date.now());
      return { user: userData, token: 'mock-token' };
    } catch (error) {
      console.error('💥 Erreur de connexion:', error);
      throw error;
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

// Composant principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
