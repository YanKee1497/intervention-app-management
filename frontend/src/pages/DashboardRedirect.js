import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'technician':
          navigate('/technician/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          // Fallback vers le dashboard général
          navigate('/dashboard-general');
      }
    }
  }, [user, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Redirection en cours...</h2>
      <p>Veuillez patienter pendant que nous vous dirigeons vers votre tableau de bord.</p>
    </div>
  );
};

export default DashboardRedirect;
