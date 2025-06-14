import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="btn btn-ghost" onClick={toggleTheme}>
      {theme === 'light' ? '🌞' : '🌜'}
    </button>
  );
};

export default ThemeToggle;
