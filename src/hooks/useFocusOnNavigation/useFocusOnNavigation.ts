import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export const useFocusOnNavigation = () => {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Focus on the main heading when route changes
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [location.pathname]);

  return headingRef;
};
