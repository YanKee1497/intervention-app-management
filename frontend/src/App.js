import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TicketsDashboard from './pages/TicketsDashboard';
import { useAuth, AuthProvider } from './context/AuthContext';
// import Header from './components/Header';
// import HeaderSimple from './components/HeaderSimple';

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
