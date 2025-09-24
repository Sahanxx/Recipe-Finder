import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const FavoritesContext = createContext(null);
const LS_KEY = 'rf_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const isFavorite = (idMeal) => favorites.some(f => f.idMeal === idMeal);

  const toggleFavorite = (meal) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.idMeal === meal.idMeal);
      if (exists) {
        toast('Removed from favorites', { description: meal.strMeal });
        return prev.filter((f) => f.idMeal !== meal.idMeal);
      }
      const pick = {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strArea: meal.strArea,
        strCategory: meal.strCategory,
      };
      toast.success('Added to favorites', { description: meal.strMeal });
      return [pick, ...prev];
    });
  };

  const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}