
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
    { href: '/courses', label: t('nav.courses') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-edu-blue to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-foreground font-armenian">
              LearnHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors font-armenian"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
              className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary text-foreground"
            >
              <option value="hy">Հայ</option>
              <option value="en">EN</option>
              <option value="ru">РУ</option>
            </select>

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
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col space-y-4 px-4 py-6">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left font-armenian"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <select
                  value={currentLanguage}
                  onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
                  className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="hy">Հայ</option>
                  <option value="en">EN</option>
                  <option value="ru">РУ</option>
                </select>
                
                <div className="flex items-center space-x-2">
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
