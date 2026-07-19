import Logo from "../assets/apple.svg?react";
// 不加 ?react 需要使用 <img src={Logo} alt="logo" />
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import DarkToggle from "./DarkToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchEnable, setIsSearchEnable] = useState(false);

  return (
    <nav 
      className="flex items-center justify-between px-4 h-16 shadow-md sticky top-0 z-50 
      bg-white/70 dark:bg-black/90 backdrop-blur-md"
    >
      <a href="#" className="text-xl font-bold">
        <Logo className="w-6 h-6 hover:scale-105 transition-transform dark:fill-white" />
      </a>
      <div className="gap-6 hidden md:flex mx-auto dark:text-white">
        <a href="#">商店</a>
        <a href="#">电脑</a>
        <a href="#">手机</a>
        <a href="#">智能家居</a>
        <a href="#">娱乐</a>
        <a href="#">技术支持</a>
      </div>
      {isSearchEnable && (
        <div className="relative">
          <input
            className="peer border border-gray-300 px-4 py-2 w-64 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <label 
            className="absolute left-2 top-2
            peer-focus:-top-2
            peer-focus:text-xs
            peer-focus:text-blue-500
            transition-all
            dark:text-white
          ">
            搜索
          </label>
        </div>
      )}
      <div className="gap-2 dark:text-white space-x-2">
        <button onClick={() => setIsSearchEnable(!isSearchEnable)}>
          <AiOutlineSearch size={24} />
        </button>
        <DarkToggle />
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <AiOutlineMenu size={24}/>
        </button>
      </div>
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 ${isOpen ? "block" : "hidden"}`}>
        <div 
          className="flex flex-col mt-17 space-y-6 
          bg-white dark:bg-black/70 text-center p-6 rounded-lg dark:text-white"
        >
          <a href="#">商店</a>
          <a href="#">电脑</a>
          <a href="#">手机</a>
          <a href="#">智能家居</a>
          <a href="#">娱乐</a>
          <a href="#">技术支持</a>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md md:hidden z-40" 
           onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
};
export default Header;
