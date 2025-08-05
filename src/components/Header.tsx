import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import { NotificationBell } from './notifications/NotificationBell';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, currentLanguage, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/specialties', label: t('nav.specialties') },
    { href: '/private-courses', label: 'Մասնավոր' },
    { href: '/jobs', label: t('nav.jobs') },
  ];

  const otherItems = [
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
      <div className="content-container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Mobile optimized */}
          <div 
            className="flex items-center space-x-2 cursor-pointer min-h-[44px] min-w-[44px]" 
            onClick={() => navigate('/')}
          >
            <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-r from-edu-blue to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">L</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground font-armenian">
              LearnHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="text-foreground/80 hover:text-foreground transition-colors font-armenian text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
            
            {/* Other dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground transition-colors font-armenian text-sm font-medium p-0 h-auto">
                  Այլ
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-lg z-50">
                {otherItems.map((item) => (
                  <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)} className="font-armenian">
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
              className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary text-foreground min-h-[36px]"
            >
              <option value="hy">Հայ</option>
              <option value="en">EN</option>
              <option value="ru">РУ</option>
            </select>

            <NotificationBell />
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
              className="min-h-[44px] min-w-[44px]"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            {/* Mobile Navigation Menu */}
            <nav className="px-4 pb-4 pt-2 border-t border-border/20">
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      navigate(item.href);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-foreground/80 hover:text-foreground transition-colors font-armenian text-base"
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Other items in mobile */}
                <div className="border-t border-border/20 pt-3 mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 font-armenian">Այլ</p>
                  {otherItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-foreground/80 hover:text-foreground transition-colors font-armenian text-base"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
            
            <div className="flex items-center justify-between pt-4 border-t border-border px-4 pb-4">
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
                className="bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground min-h-[44px] flex-1 mr-2"
              >
                <option value="hy">Հայ</option>
                <option value="en">EN</option>
                <option value="ru">РУ</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <NotificationBell />
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
