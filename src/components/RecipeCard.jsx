import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function RecipeCard({ meal }) {
  const { idMeal, strMeal, strMealThumb } = meal;
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(idMeal);

  const heartClasses = [
    'border rounded-md px-2 py-1 text-sm cursor-pointer transition',
    'border-slate-300 text-slate-600 hover:text-red-600 hover:border-red-300',
    'dark:border-slate-700 dark:text-slate-400 dark:hover:text-red-400 dark:hover:border-red-800',
    fav ? 'text-red-600 border-red-300 bg-red-100/40 dark:text-red-500 dark:border-red-900 dark:bg-red-900/20' : '',
  ].join(' ');

  return (
    <div className="bg-white/80 border border-slate-200 rounded-xl overflow-hidden shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
      <Link to={`/recipe/${idMeal}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={strMealThumb}
            alt={strMeal}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/recipe/${idMeal}`} className="font-bold leading-tight hover:underline">
            {strMeal}
          </Link>
          <button
            className={heartClasses}
            onClick={() => toggleFavorite(meal)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '♥' : '♡'}
          </button>
        </div>
        <Link
          to={`/recipe/${idMeal}`}
          className="mt-1 inline-block text-blue-600 hover:underline dark:text-blue-400"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}