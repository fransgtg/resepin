import { useEffect } from 'react';

export function useModalHistory(onClose, isOpen) {
  useEffect(() => {
    if (!isOpen) return;

    if (!window.history.state || !window.history.state.modal) {
      window.history.pushState({ modal: true }, '');
    }

    const handlePopState = (e) => {
      if (!e.state || !e.state.modal) {
        onClose?.();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

    };
  }, [isOpen, onClose]);
}