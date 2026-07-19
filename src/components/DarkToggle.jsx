import { FiSun } from "react-icons/fi";

function DarkToggle() {
    const toggleDark = () => {
        document.documentElement.classList.toggle("dark");
    };

    return (
      <button 
        className="p-1 bg-gray-200 dark:bg-grey-600 rounded-full
        hover:bg-grey-300 dark:hover:bg-grey-400 transition-all duration-300
        hover:rotate-12
      "
      onClick={toggleDark}
      >
        <FiSun size={24} className="text-yellow-400 animate-pulse" />
      </button>
    );
}

export default DarkToggle;