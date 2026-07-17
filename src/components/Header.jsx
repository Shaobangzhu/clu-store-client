import Logo from "../assets/apple.svg?react";
// 不加 ?react 需要使用 <img src={Logo} alt="logo" />
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 h-16 shadow-md sticky top-0 z-50 bg-white/70 backdrop-blur-md">
      <a href="#" className="text-xl font-bold">
        <Logo className="w-6 h-6 hover:scale-105 transition-transform" />
      </a>
      <div className="flex gap-6 hidden md:flex mx-auto">
        <a href="#">商店</a>
        <a href="#">电脑</a>
        <a href="#">手机</a>
        <a href="#">智能家居</a>
        <a href="#">娱乐</a>
        <a href="#">技术支持</a>
      </div>
      <button className="md:hidden" onClick={() => setIsOpen(true)}>
        <AiOutlineMenu size={24}/>
      </button>
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 ${isOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col mt-17 space-y-6 bg-white text-center p-6 rounded-lg">
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
