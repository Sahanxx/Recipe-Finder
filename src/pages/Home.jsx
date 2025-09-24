import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMeals } from '../services/mealsApi.js';
import RecipeCard from '../components/RecipeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';

const PAGE_SIZE = 12;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [term, setTerm] = useState(query);

  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  // Infinite scroll
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  // Keep input synced with URL
  useEffect(() => setTerm(query), [query]);

  // Debounce: update q in URL after 500ms
  useEffect(() => {
    const value = term.trim();
    const h = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set('q', value);
      else next.delete('q');
      setSearchParams(next, { replace: true });
    }, 500);
    return () => clearTimeout(h);
  }, [term, searchParams, setSearchParams]);

  // Fetch meals when query changes
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!query) {
        setMeals([]);
        setStatus('idle');
        setVisibleCount(PAGE_SIZE);
        return;
      }
      setStatus('loading');
      setVisibleCount(PAGE_SIZE);
      try {
        const results = await searchMeals(query);
        if (!ignore) {
          setMeals(results ?? []);
          setStatus('success');
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setStatus('error');
      }
    };
    run();
    return () => { ignore = true; };
  }, [query]);

  // Infinite scroll observer
  useEffect(() => {
    if (status !== 'success') return;
    if (visibleCount >= meals.length) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, meals.length));
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [status, meals.length, visibleCount]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    const value = term.trim();
    if (value) next.set('q', value);
    else next.delete('q');
    setSearchParams(next);
  };

  const visibleMeals = meals.slice(0, visibleCount);
  const hasMore = visibleCount < meals.length;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[url('/food-bg.jpg')] bg-cover bg-center bg-fixed">
      {/* Glass container */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="rounded-3xl shadow-xl border border-white/10 bg-white/70 backdrop-blur-md dark:bg-black/60 dark:border-white/10 px-4 sm:px-8 py-6 sm:py-10">
          {/* Title */}
          <h1 className="text-center text-3xl sm:text-5xl font-extrabold tracking-wide text-slate-900 drop-shadow dark:text-white">
            Food Recipe Finder
          </h1>

          {/* Search bar with icon */}
          <form onSubmit={onSubmit} className="mt-6 flex justify-center">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search recipes (e.g., egg, pasta, chicken)…"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full rounded-xl bg-white/90 border border-slate-300 pl-12 pr-12 py-3 text-slate-900 placeholder-slate-500 shadow focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300
                           dark:bg-slate-900/80 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-400 dark:focus:ring-blue-400/40"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">🔍</span>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500
                           dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300"
                title="Search"
              >
                Search
              </button>
            </div>
          </form>

          {/* Results */}
          {!query && (
            <div className="mt-8 text-center text-slate-600 dark:text-slate-300">
              Type something above to find recipes.
            </div>
          )}

          {status === 'loading' && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {status === 'error' && (
            <p className="mt-8 text-center text-red-600 dark:text-red-300">Oops! Something went wrong.</p>
          )}

          {status === 'success' && meals.length === 0 && (
            <p className="mt-8 text-center text-slate-700 dark:text-slate-300">
              No recipes found for “{query}”.
            </p>
          )}

          {status === 'success' && meals.length > 0 && (
            <>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {visibleMeals.map((meal) => (
                  <RecipeCard key={meal.idMeal} meal={meal} />
                ))}
              </div>

              {hasMore ? (
                <>
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, meals.length))}
                      className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-white/70 hover:bg-white transition
                                 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                    >
                      Load more
                    </button>
                  </div>
                  <div ref={sentinelRef} className="h-6" />
                </>
              ) : (
                <p className="text-center text-slate-600 dark:text-slate-400 mt-8">End of results</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}