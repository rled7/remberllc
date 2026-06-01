import { useEffect, useState } from 'react';

/**
 * Returns true once the window has scrolled past `threshold` px.
 * Used to give the sticky navbar a solid background after the hero.
 */
export default function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
