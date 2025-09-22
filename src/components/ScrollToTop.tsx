import { useScrollToTop } from '@/hooks/useScrollToTop';

/**
 * ScrollToTop Component
 * Bu component hər səhifə dəyişikliyində avtomatik olaraq səhifəni yuxarıya çəkir
 * App.tsx-də istifadə edilməlidir ki, bütün route dəyişikliklərini tutub
 */
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export default ScrollToTop;