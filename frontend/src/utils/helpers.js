// Fonctions utilitaires pour l'application

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'status-pending',
    assigned: 'status-assigned',
    in_progress: 'status-progress',
    resolved: 'status-resolved',
    rejected: 'status-rejected'
  };
  return colors[status] || 'status-default';
};

export const getUrgencyColor = (urgency) => {
  const colors = {
    low: 'urgency-low',
    medium: 'urgency-medium',
    high: 'urgency-high',
    critical: 'urgency-critical'
  };
  return colors[urgency] || 'urgency-default';
};

export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  
  return formatDate(dateString);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getServiceIcon = (serviceIcon) => {
  const icons = {
    wrench: '🔧',
    computer: '💻',
    truck: '🚛',
    cleaning: '🧹',
    shield: '🛡️',
    default: '📋'
  };
  return icons[serviceIcon] || icons.default;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Au moins 8 caractères
  return password.length >= 8;
};

export const getInitials = (firstname, lastname) => {
  return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
};

export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
