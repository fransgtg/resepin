import { useEffect } from 'react';

export function useBackBrowser(onBack) {
  useEffect(() => {
    window.history.pushState({ modal: true }, '');

    const handlePopState = () => {
      if (onBack) onBack();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state && window.history.state.modal) {
        window.history.back();
      }
    };
  }, [onBack]);
}