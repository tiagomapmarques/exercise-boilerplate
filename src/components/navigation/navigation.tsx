import { Link, useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';

export type NavigationProps = {
  onNavigate?: () => void;
};

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const location = useLocation();

  useEffect(() => {
    onNavigate?.();
  }, [location.pathname]);

  return (
    <>
      <Link to="/">Home</Link>
      <Link to={'/about' as '/'}>About</Link>
    </>
  );
};
