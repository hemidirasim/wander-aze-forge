import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that automatically scrolls to top when route changes
 * Bu hook hər səhifə dəyişikliyində avtomatik olaraq səhifəni yuxarıya çəkir
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};

/**
 * Function to manually scroll to top
 * Manual olaraq səhifəni yuxarıya çəkmək üçün funksiya
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Function to scroll to top instantly (no smooth animation)
 * Dərhal səhifəni yuxarıya çəkmək üçün funksiya (animasiya olmadan)
 */
export const scrollToTopInstant = () => {
  window.scrollTo(0, 0);
};
