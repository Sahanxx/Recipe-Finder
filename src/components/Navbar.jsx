import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const linkBase =
    'px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white';

  const ThemeIcon = theme === 'dark' ? '☀️' : '🌙';
  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <header className="sticky top-0 z-10 bg-white/60 backdrop-blur border-b border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-3 py-2">
        <NavLink to="/" className="text-blue-600 font-extrabold tracking-wide text-xl dark:text-blue-400">
          RecipeFinder
        </NavLink>

        <nav className="flex gap-2">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white' : ''}`}>
            Favorites
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="ml-auto px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:border-blue-300 hover:text-slate-900 transition dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-white"
          aria-label={themeLabel}
          title={themeLabel}
        >
          {ThemeIcon}
        </button>
      </div>
    </header>
  );
}