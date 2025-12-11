import { useEffect } from 'react';

export function useModalHistory(onClose, isOpen) {
  useEffect(() => {
    if (!isOpen) return;

    // Push state baru hanya jika state sekarang bukan modal
    if (!window.history.state || !window.history.state.modal) {
      window.history.pushState({ modal: true }, '');
    }

    const handlePopState = (e) => {
      // Tutup modal hanya jika state sebelumnya adalah modal
      if (!e.state || !e.state.modal) {
        onClose?.();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Jangan otomatis back di cleanup, biarkan browser handle sendiri
    };
  }, [isOpen, onClose]);
}