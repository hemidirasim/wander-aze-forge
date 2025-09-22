# Scroll to Top Functionality

Bu layihədə bütün səhifələrə scroll-to-top funksiyası əlavə edilib.

## 📋 Komponentlər

### 1. `useScrollToTop.ts` Hook
**Məkan:** `src/hooks/useScrollToTop.ts`

**Funksiyalar:**
- `useScrollToTop()` - Hər route dəyişikliyində avtomatik scroll-to-top
- `scrollToTop()` - Manual smooth scroll-to-top
- `scrollToTopInstant()` - Dərhal scroll-to-top (animasiya olmadan)

### 2. `ScrollToTop.tsx` Component
**Məkan:** `src/components/ScrollToTop.tsx`

**Məqsəd:** 
- Hər səhifə dəyişikliyində avtomatik olaraq səhifəni yuxarıya çəkir
- `App.tsx`-də istifadə edilir ki, bütün route dəyişikliklərini tutsun

### 3. `ScrollToTopButton.tsx` Component
**Məkan:** `src/components/ScrollToTopButton.tsx`

**Xüsusiyyətlər:**
- 300px aşağıya scroll edəndə görünür
- Sağ alt küncdə fixed position
- Click edəndə smooth scroll-to-top
- Responsive dizayn

## 🔧 Tətbiq Edilən Yerlər

### App.tsx
```tsx
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// BrowserRouter içində
<ScrollToTop />
<ScrollToTopButton />
```

### Navigation.tsx
Bütün navigation link'lərinə `scrollToTopInstant()` əlavə edilib:
- Logo click
- Desktop menu links
- Mobile menu links
- Tours dropdown links
- Book Now button

## ✅ Funksionallıq

### Avtomatik Scroll-to-Top
- **Hər route dəyişikliyində** avtomatik olaraq səhifə yuxarıya çəkilir
- **Smooth animation** ilə
- **React Router** location change'i detect edir

### Manual Scroll-to-Top Button
- **300px scroll** edəndən sonra görünür
- **Fixed position** sağ alt küncədə
- **Primary color** ilə dizayn edilib
- **Hover effects** və **shadow** ilə

### Navigation Integration
- **Bütün navigation link'ləri** click edəndə instant scroll-to-top
- **Mobile və desktop** versiyalarda işləyir
- **Tours dropdown** link'lərində də aktiv

## 🎨 Stil Xüsusiyyətləri

### ScrollToTopButton Styling
```css
- Position: fixed bottom-8 right-8
- Z-index: 50
- Size: 12x12 (48px)
- Border-radius: full (rounded-full)
- Background: primary color
- Shadow: lg və xl hover
- Transition: smooth 300ms
```

### Animation
- **Smooth scroll behavior** `behavior: 'smooth'`
- **Button fade in/out** visibility based on scroll position
- **Hover effects** shadow və color changes

## 📱 Responsive Behavior

### Desktop
- Button sağ alt küncədə (bottom-8 right-8)
- Navigation link'lərində instant scroll

### Mobile
- Button eyni yerdə qalır
- Mobile menu close olduqdan sonra scroll
- Touch-friendly 48px minimum size

## 🔄 İstifadə Nümunələri

### Hook istifadəsi
```tsx
import { useScrollToTop, scrollToTop } from '@/hooks/useScrollToTop';

// Avtomatik scroll-to-top
const MyComponent = () => {
  useScrollToTop(); // Route change'də avtomatik
  return <div>...</div>;
};

// Manual scroll-to-top
const handleClick = () => {
  scrollToTop(); // Smooth animation
};
```

### Component istifadəsi
```tsx
// App.tsx-də
<BrowserRouter>
  <Routes>...</Routes>
  <ScrollToTop />          {/* Avtomatik route scroll */}
  <ScrollToTopButton />    {/* Manual scroll button */}
</BrowserRouter>
```

## ⚡ Performance

### Optimizasyon
- **Event listener** scroll üçün throttle edilib
- **useEffect cleanup** memory leak'ləri önləyir
- **Conditional rendering** button visibility üçün

### Browser Uyumluluğu
- **Modern browsers** smooth scroll dəstəkləyir
- **Fallback** instant scroll eski browser'lar üçün
- **Progressive enhancement** approach

## 🎯 Faydalar

1. **Yaxşı UX** - İstifadəçi həmişə səhifənin yuxarısından başlayır
2. **Accessibility** - Keyboard navigation friendly
3. **Mobile Friendly** - Touch device'larda rahat istifadə
4. **Performance** - Efficient scroll handling
5. **Consistent** - Bütün səhifələrdə eyni davranış

Bu sistem sayəsində istifadəçilər hər səhifəyə keçid edərkən səhifənin yuxarısından başlayacaq və lazım olduqda manual olaraq da yuxarıya qayıda biləcəklər.
