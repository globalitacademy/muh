import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import { NotificationBell } from './notifications/NotificationBell';
import { useNavigate } from 'react-router-dom';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';

const Header = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/specialties', label: t('nav.specialties') },
    { href: '/private-courses', label: t('nav.private') },
    { href: '/jobs', label: t('nav.jobs') },
    { href: '/projects', label: t('nav.projects') || 'Նախագծdelays' },
  ];

  const otherItems = [
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
      <div className="content-container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer min-h-[44px] min-w-[44px]" 
            onClick={() => navigate('/')}
          >
            <img 
              src={resolvedTheme === 'dark' ? logoDark : logoLight} 
              alt="LearnHub" 
              className="h-6 sm:h-8" 
            />
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
                  {t('nav.other')}
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

          {/* Mobile actions - compact top bar */}
          <div className="md:hidden flex items-center space-x-1">
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as 'hy' | 'en' | 'ru')}
              className="bg-background border border-border rounded-lg px-1.5 py-1 text-xs focus:outline-none focus:border-primary text-foreground min-h-[32px] w-14"
            >
              <option value="hy">Հայ</option>
              <option value="en">EN</option>
              <option value="ru">РУ</option>
            </select>
            <NotificationBell />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navigation removed - using BottomNavigation instead */}
      </div>
    </header>
  );
};

export default Header;
