import { useFavorites } from '../context/FavoritesContext.jsx';
import RecipeCard from '../components/RecipeCard.jsx';

export default function Favorites() {
  const { favorites } = useFavorites();
  return (
    <div>
      <h2 className="text-xl font-semibold">Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-slate-400 mt-2">You haven’t added any favorites yet.</p>
      ) : (
        <div className="mt-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {favorites.map((meal) => (
            <RecipeCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}