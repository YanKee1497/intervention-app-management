import './App.css';
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TicketsDashboard from './pages/TicketsDashboard';
// import Header from './components/Header';
// import HeaderSimple from './components/HeaderSimple';

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
              padding: '10px',
              background: '#ff7675',
              color: 'white',
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
  return <TicketsDashboard />;
}

// Composant pour protéger les routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  console.log('🔍 ProtectedRoute - user:', user);
  return user ? children : <Navigate to="/login" />;
}

// Fournisseur de contexte d'authentification
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log('🔍 AuthProvider - user actuel:', user);

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
    console.log('🚪 Déconnexion');
    setUser(null);
    localStorage.removeItem('token');
  };

  // Vérification du token au démarrage
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.startsWith('mock-token')) {
      console.log('🔍 Token trouvé, connexion automatique');
      setUser({
        id: 1,
        email: 'user@entreprise.com',
        nom: 'Utilisateur',
        prenom: 'Demo',
        role: 'employee'
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Composant principal
function App() {
  console.log('🔍 App principal chargé');
  
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
