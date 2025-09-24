import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Recipe from './pages/Recipe.jsx';
import Favorites from './pages/Favorites.jsx';
import { Toaster } from 'sonner';
import { useTheme } from './context/ThemeContext.jsx';

export default function App() {
  const { theme } = useTheme();
  const toasterTheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system';

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        theme={toasterTheme}
        richColors
        closeButton
        expand
      />
    </div>
  );
}