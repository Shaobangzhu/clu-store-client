import Logo from "../assets/apple.svg?react";
// 不加 ?react 需要使用 <img src={Logo} alt="logo" />
import {
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShopping,
} from "react-icons/ai";
import { useState, useContext, useEffect, useRef } from "react";
import DarkToggle from "./DarkToggle";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { SHOPPING_PAGES } from "@/assets/data/path";
import { ShoppingCartContext } from "@/contexts/shoppingCart";
import { AnimatePresence, motion } from "framer-motion";
import { IoLanguageOutline } from "react-icons/io5";
import { type RootState } from "../redux/store";
import { languageSet, type CultureCode } from "@/redux/i18nReducer";
import { setCulture } from "@/redux/i18nSlice";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { AUTH_PAGES } from "@/assets/data/path";

import { logout } from "@/redux/userSlice";
import useApiData from '@/hooks/useApiData';
import { catalogService } from '@/api/services';

const Header = () => {
  const { user, status } = useSelector((state: RootState) => state.user);
  const username = user?.username;

  const { t } = useTranslation();
  const categories = useApiData('navigation:categories', async signal => (await catalogService.categories({ signal })).data);
  const shoppingPages = [
    { path: '/', label: t('routes.store') },
    ...(categories.data ?? []).map(category => ({
      path: `/categories/${encodeURIComponent(category.slug)}`,
      label: t(`routes.${category.slug === 'tablets' ? 'ipad' : category.slug}`, { defaultValue: category.title }),
    })),
    ...(status === 'authenticated' ? [{ path: '/user', label: t('orders.title') }] : []),
    ...(status === 'authenticated' && user?.role === 'ADMIN' ? [{ path: '/admin/orders', label: t('orders.admin') }] : []),
    ...SHOPPING_PAGES.filter(page => page.id === 'entertainment' || page.id === 'support')
      .map(page => ({ path: page.path, label: t(`routes.${page.id}`) })),
  ];
  const currentLanguage = useSelector<RootState, CultureCode>(
    (state) => state.i18n.currentLanguage,
  );
  const dispatch = useDispatch();

  const { cartItems } = useContext(ShoppingCartContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setIsOpen(false); setIsSearchEnable(false); }, [location]);
  useEffect(() => {
    if (isOpen) menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
  }, [isOpen]);
  const closeMenu = () => { setIsOpen(false); menuButtonRef.current?.focus(); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/search?query=${encodeURIComponent(query)}`);
        setQuery("");
      }
    }
  };

  // HTMLInputElement | null
  const inputRef = useRef<HTMLInputElement | null>(null);
  // ref
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchEnable]);

  const handleLanguageChange = () => {
    const currentIndex = languageSet.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languageSet.length;
    const nextLanguage = languageSet[nextIndex] ?? languageSet[0];
    dispatch(setCulture(nextLanguage));
  };



  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/signin");
  };

  return (
    <nav
      className="flex items-center justify-between px-4 h-16 sticky top-0 z-50 
      bg-apple-light
      dark:bg-apple-dark 
      shadow-apple-md
      backdrop-blur-md"
    >
      <NavLink to="/" aria-label={t("routes.store")} className="text-xl font-bold">
        <Logo className="w-6 h-6 hover:scale-105 transition-transform dark:fill-white" />
      </NavLink>
      <div
        className="gap-6 hidden md:flex mx-auto
        text-apple-text-light
        dark:text-apple-text-dark"
      >
        {shoppingPages.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            end={page.path === "/"}
            className={({ isActive }) => `
            hover:text-apple-blue ${
              isActive
                ? "text-apple-blue font-extrabold"
                : "text-apple-text-light dark:text-apple-text-dark"
            }
          `}
          >
            {page.label}
          </NavLink>
        ))}
        {categories.error && <button onClick={() => { void categories.fetchData().catch(() => {}); }}>
          {t('catalog.retry')}
        </button>}
      </div>
      {isSearchEnable && (
        <div className="relative">
          <input
            id="header-search"
            aria-label={t("header.search")}
            onKeyUp={event => { if (event.key === "Escape") { setIsSearchEnable(false); searchButtonRef.current?.focus(); } }}
            ref={inputRef}
            className="peer border 
            border-apple-gray-200 px-4 py-2 w-64 rounded-lg focus:outline-none focus:ring-2 
            focus:ring-apple-blue transition"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label htmlFor="header-search"
            className="absolute left-2 top-2
            peer-focus:-top-2
            peer-focus:text-xs
            peer-focus:text-apple-blue
            transition-all
            text-apple-text-light
            dark:text-apple-text-dark
          "
          >
            {t("header.search")}
          </label>
        </div>
      )}
      <div
        className="
        flex items-center
        gap-2
        text-apple-text-light
        dark:text-apple-text-dark 
        space-x-2
        "
      >
        <button ref={searchButtonRef} aria-label={t("header.search")} aria-expanded={isSearchEnable} onClick={() => setIsSearchEnable((prev) => !prev)}>
          <AiOutlineSearch size={24} />
        </button>
        <DarkToggle />
        <button aria-label={t("ui.language")} onClick={handleLanguageChange}>
          <IoLanguageOutline size={24} />
        </button>
        <button aria-label={t("ui.cart")} onClick={() => navigate("/cart")} className="relative">
          <AiOutlineShopping size={24} />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.span
                className="absolute 
                top-0 right-0 translate-x-1/2 -translate-y-1/2 
                bg-apple-red text-white text-xs font-bold
                w-5 h-5 rounded-full
                flex items-center justify-center
                "
                key={cartItems.length} // 让动画在数字变化时，重新渲染
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {cartItems.length}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {username ? (
          <>
            <span>{username}</span>
            <button className="hover: text-apple-blue" onClick={handleLogout}>
              {t("ui.logout")}
            </button>
          </>
        ) : (
          AUTH_PAGES.map((page) => (
            <NavLink
              key={page.id}
              to={page.path}
            end={page.path === "/"}
              className={({ isActive }) =>
                `hover:text-apple-blue hidden md:block ${
                  isActive
                    ? "text-apple-blue font-extrabold"
                    : "text-apple-text dark:text-apple-text-dark"
                }`
              }
            >
              {t(`routes.${page.id}`)}
            </NavLink>
          ))
        )}
        <button ref={menuButtonRef} aria-label={t("ui.menu")} aria-expanded={isOpen} aria-controls="mobile-navigation" className="md:hidden" onClick={() => isOpen ? closeMenu() : setIsOpen(true)}>
          <AiOutlineMenu size={24} />
        </button>
      </div>
      <div
        id="mobile-navigation" ref={menuRef}
        onKeyDown={event => { if (event.key === 'Escape') closeMenu(); }}
        className={`md:hidden z-20 fixed top-0 right-0 h-full w-64 ${isOpen ? "block" : "hidden"}`}
      >
        <div
          className="flex flex-col mt-17 space-y-6 
          bg-apple-light 
          dark:bg-apple-dark
          shadow-apple-md
          text-center p-6 rounded-lg
          text-apple-text-light
          dark:text-apple-text-dark"
        >
          <button onClick={closeMenu}>{t("ui.close")}</button>
          {shoppingPages.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
            end={page.path === "/"}
              className={({ isActive }) => `
              hover:text-apple-blue ${
                isActive
                  ? "text-apple-blue font-extrabold"
                  : "text-apple-text-light dark:text-apple-text-dark"
              }
              `}
              onClick={() => setIsOpen(false)}
            >
              {page.label}
            </NavLink>
          ))}
          {categories.error && <button onClick={() => { void categories.fetchData().catch(() => {}); }}>
            {t('catalog.retry')}
          </button>}
          <hr className="border-t border-gray-300" />
          {username ? (
            <>
              <span>{username}</span>
              <button className="hover: text-apple-blue" onClick={handleLogout}>
                {t("ui.logout")}
              </button>
            </>
          ) : (
            AUTH_PAGES.map((page) => (
              <NavLink
                key={page.id}
                to={page.path}
            end={page.path === "/"}
                className={({ isActive }) =>
                  `hover:text-apple-blue ${
                    isActive
                      ? "text-apple-blue font-extrabold"
                      : "text-apple-text dark:text-apple-text-dark"
                  }`
                }
              >
                {t(`routes.${page.id}`)}
              </NavLink>
            ))
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 
          bg-apple-black/50
          dark:bg-apple-white/10
          backdrop-blur-md"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
};
export default Header;
