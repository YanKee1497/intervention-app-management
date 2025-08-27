import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('admin@entreprise.com');
  const [password, setPassword] = useState('password123');

  console.log('🔍 App simple chargée');

  const handleLogin = () => {
    console.log('🚀 Tentative de connexion avec:', email);
    setIsLoggedIn(true);
    console.log('✅ Connexion réussie !');
  };

  if (isLoggedIn) {
    return (
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <h1>🎉 Dashboard - Connexion réussie !</h1>
        <p>Utilisateur connecté : {email}</p>
        <button 
          onClick={() => setIsLoggedIn(false)}
          style={{
            padding: '10px 20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '400px',
        textAlign: 'center'
      }}>
        <h1>🔒 Connexion Simple</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>
        
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '15px',
            background: '#0984e3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Se connecter
        </button>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Version simple de test
        </p>
      </div>
    </div>
  );
}

export default App;
