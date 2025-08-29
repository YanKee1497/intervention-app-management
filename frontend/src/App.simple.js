import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Application de gestion d'interventions</h1>
        <p>Test de base - si vous voyez ceci, React fonctionne !</p>
      </div>
    </Router>
  );
}

export default App;
