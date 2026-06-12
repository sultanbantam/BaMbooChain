import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BackButton = ({ to, label, style = {} }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <button 
      onClick={() => to ? navigate(to) : navigate(-1)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: 'var(--text-main)',
        cursor: 'pointer',
        marginTop: '20px',
        marginBottom: '10px',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        zIndex: 50,
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(-4px)';
        e.currentTarget.style.background = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        e.currentTarget.style.color = 'var(--text-main)';
      }}
    >
      <ArrowLeft size={18} />
      <span>{label || t('tr_back')}</span>
    </button>
  );
};

export default BackButton;
