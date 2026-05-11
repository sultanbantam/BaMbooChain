import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const GlobalToast = () => {
  const { activeToast } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [toastData, setToastData] = useState(null);

  useEffect(() => {
    if (activeToast) {
      setToastData(activeToast);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500); // Hide animation before removing from DOM
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [activeToast]);

  if (!toastData && !isVisible) return null;

  const getIcon = () => {
    switch(toastData?.type) {
      case 'success': return <CheckCircle size={24} color="white" />;
      case 'warning': return <AlertTriangle size={24} color="white" />;
      default: return <Info size={24} color="white" />;
    }
  };

  const getBgColor = () => {
    switch(toastData?.type) {
      case 'success': return '#0ca678';
      case 'warning': return '#f59f00';
      case 'error': return '#e03131';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: isVisible ? '30px' : '-100px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: getBgColor(),
      color: 'white',
      padding: '16px 24px',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      zIndex: 100000,
      opacity: isVisible ? 1 : 0,
      minWidth: '300px',
      maxWidth: '90vw'
    }}>
      {getIcon()}
      <div style={{ flex: 1, fontWeight: '600', fontSize: '0.95rem' }}>
        {toastData?.text}
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default GlobalToast;
