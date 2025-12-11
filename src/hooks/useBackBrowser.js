import { useEffect } from 'react';

export function useBackBrowser(onBack) {
  useEffect(() => {
    // Push state baru agar modal punya entry di history
    window.history.pushState({ modal: true }, '');

    const handlePopState = () => {
      if (onBack) onBack();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Hapus state agar tidak menumpuk
      if (window.history.state && window.history.state.modal) {
        window.history.back();
      }
    };
  }, [onBack]);
}