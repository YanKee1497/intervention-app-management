import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: null 
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token, user: userData }
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // MODE LOCAL - Simulation de connexion sans backend
      console.log('🔄 MODE LOCAL - Connexion avec:', { email, password: '***' });
      
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
      
      const mockResponse = {
        user: userData,
        token: 'mock-token-' + Date.now()
      };
      
      console.log('✅ MODE LOCAL - Connexion réussie:', userData);
      
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: mockResponse
      });
      
      return mockResponse;
    } catch (error) {
      console.error('💥 Erreur de connexion:', error);
      const errorMessage = 'Erreur de connexion, vérifiez vos identifiants';
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    // Redirection vers la page de connexion
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // MODE LOCAL - Simulation d'inscription sans backend
      console.log('🔄 MODE LOCAL - Inscription avec:', userData);
      
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulation de création d'utilisateur
      const newUser = {
        id: Date.now(), // ID unique basé sur timestamp
        ...userData,
        role: userData.role || 'employee' // Rôle par défaut
      };
      
      const mockResponse = {
        user: newUser,
        token: 'mock-token-' + Date.now()
      };
      
      console.log('✅ MODE LOCAL - Inscription réussie:', newUser);
      
      // Pas de sauvegarde automatique pour l'inscription en mode local
      // L'utilisateur devra se connecter après l'inscription
      
      return mockResponse;
    } catch (error) {
      console.error('💥 Erreur d\'inscription:', error);
      const errorMessage = 'Erreur lors de l\'inscription';
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
