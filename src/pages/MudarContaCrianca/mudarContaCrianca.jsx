import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MudarContaCrianca() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.setItem('tipo', 'crianca');
    navigate('/Acesso');
  }, [navigate]);

  return <p>Redirecionando para a conta da criança...</p>;
}