import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Busca o token e as informações do usuário salvas no login
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Se não houver token, redireciona imediatamente para o Login (/)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se estiver logado, permite que a página solicitada (children) seja renderizada
  return children;
};

export default ProtectedRoute;