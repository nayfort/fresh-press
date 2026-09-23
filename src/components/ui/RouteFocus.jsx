import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function RouteFocus() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  }, [pathname, navigationType]);
  return null;
}
