
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, currentLanguage, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/specialties', label: 'Մասնագիտություններ' },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-8xl mx-auto">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-18">
          {/* Logo - Ultra responsive */}
          <div 
            className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 cursor-pointer min-h-[40px] sm:min-h-[44px] md:min-h-[48px] min-w-[40px] sm:min-w-[44px] md:min-w-[48px]" 
            onClick={() => navigate('/')}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-r from-edu-blue to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg">L</span>
            </div>
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground font-armenian">
              LearnHub
            </span>
          </div>

          {/* Desktop Navigation - Enhanced responsive */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="text-sm lg:text-base xl:text-lg text-muted-foreground hover:text-foreground transition-colors font-armenian min-h-[44px] px-2 xl:px-3 py-2 rounded-lg hover:bg-accent/50"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions - Enhanced responsive */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 2xl:space-x-4">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
              className="bg-background border border-border rounded-lg px-2 xl:px-3 py-1.5 xl:py-2 text-sm xl:text-base focus:outline-none focus:border-primary text-foreground min-h-[36px] xl:min-h-[40px]"
            >
              <option value="hy">Հայ</option>
              <option value="en">EN</option>
              <option value="ru">РУ</option>
            </select>

            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Tablet Navigation (768px - 1023px) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-3">
            {menuItems.slice(0, 2).map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-armenian min-h-[40px] px-2 py-1.5 rounded-lg hover:bg-accent/50"
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="min-h-[40px] min-w-[40px]"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </nav>

          {/* Tablet Actions */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Ultra responsive */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-0.5 sm:space-y-1 py-2 sm:py-3">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left font-armenian p-2.5 sm:p-3 md:p-4 rounded-lg min-h-[44px] sm:min-h-[48px] w-full text-sm sm:text-base"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                <select
                  value={currentLanguage}
                  onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
                  className="bg-background border border-border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:border-primary text-foreground min-h-[40px] sm:min-h-[44px] flex-1 mr-2 sm:mr-3"
                >
                  <option value="hy">Հայ</option>
                  <option value="en">EN</option>
                  <option value="ru">РУ</option>
                </select>
                
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <ThemeToggle />
                  <UserMenu />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
