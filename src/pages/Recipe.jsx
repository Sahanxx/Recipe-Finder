import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMealById } from '../services/mealsApi.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

function getIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ingr = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingr && ingr.trim()) items.push(`${measure || ''} ${ingr}`.trim());
  }
  return items;
}

export default function Recipe() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState('loading');
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    getMealById(id)
      .then((m) => { if (!ignore) { setMeal(m); setStatus('success'); } })
      .catch(() => !ignore && setStatus('error'));
    return () => { ignore = true; };
  }, [id]);

  const ingredients = useMemo(() => (meal ? getIngredients(meal) : []), [meal]);

  if (status === 'loading') return <p className="text-slate-400">Loading recipe…</p>;
  if (status === 'error' || !meal) return <p className="text-red-300">Recipe not found.</p>;

  const fav = isFavorite(meal.idMeal);

  return (
    <article className="space-y-6">
      <div className="grid md:grid-cols-[320px_1fr] gap-4 items-start">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full rounded-xl border border-slate-800" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{meal.strMeal}</h1>
          <p className="text-slate-400">
            {[meal.strArea, meal.strCategory].filter(Boolean).join(' • ')}
          </p>
          <button
            className={[
              'inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition',
              'border border-slate-800 text-slate-300 hover:border-red-800 hover:text-red-400',
              fav ? 'bg-red-900/20 border-red-900 text-red-500' : '',
            ].join(' ')}
            onClick={() => toggleFavorite(meal)}
          >
            {fav ? '♥ Favorited' : '♡ Add to favorites'}
          </button>
          {meal.strSource && (
            <p className="text-sm">
              Source:{' '}
              <a href={meal.strSource} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                {meal.strSource}
              </a>
            </p>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside columns-2 gap-4 pl-1">
          {ingredients.map((it, idx) => <li key={idx}>{it}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{meal.strInstructions}</p>
      </section>

      {meal.strYoutube && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Video</h2>
          <div className="max-w-[720px]">
            <iframe
              className="w-full aspect-video rounded-xl border-0"
              src={`https://www.youtube.com/embed/${new URL(meal.strYoutube).searchParams.get('v')}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </article>
  );
}