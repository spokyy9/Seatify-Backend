import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'rgba(74, 222, 128, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(59, 130, 246, 0.1)',
  }[type];

  const borderColor = {
    success: 'rgba(74, 222, 128, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    info: 'rgba(59, 130, 246, 0.3)',
  }[type];

  const textColor = {
    success: '#4ade80',
    error: '#ef4444',
    info: '#3b82f6',
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        padding: '14px 20px',
        color: textColor,
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 10000,
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{message}</span>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
