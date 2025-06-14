import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { BsSun, BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-grayText dark:text-primary"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <BsSun className="w-5 h-5" /> : <BsSunFill className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
