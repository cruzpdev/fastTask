import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  children: ReactNode;
  tamanho?: 'pequeno' | 'medio' | 'grande';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  titulo, 
  children, 
  tamanho = 'medio' 
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Impedir o scroll do body quando o modal estiver aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const tamanhoClasses = {
    pequeno: 'modal-conteudo-pequeno',
    medio: 'modal-conteudo-medio',
    grande: 'modal-conteudo-grande',
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-conteudo ${tamanhoClasses[tamanho]}`}>
        <div className="modal-cabecalho">
          <h2 className="modal-titulo">{titulo}</h2>
          <button 
            className="modal-fechar" 
            onClick={onClose}
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>
        <div className="modal-corpo">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
