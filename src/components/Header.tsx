
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.courses', href: '/courses' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.contact', href: '/contact' }
  ];

  const languages = [
    { code: 'hy', name: 'Հայերեն' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-edu-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ԿԱՍ</span>
            </div>
            <span className="font-bold text-xl text-edu-blue font-armenian">
              Կրթություն առանց սահմանների
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`font-medium transition-colors font-armenian ${
                  isActive(item.href)
                    ? 'text-edu-blue'
                    : 'text-gray-600 hover:text-edu-blue'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">
                  {languages.find(lang => lang.code === language)?.name}
                </span>
              </Button>
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLanguageOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        language === lang.code ? 'bg-edu-light-blue' : ''
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/login">
              <Button variant="ghost" className="font-armenian">
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-edu-blue hover:bg-edu-dark-blue font-armenian">
                {t('nav.register')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`block px-4 py-2 font-medium font-armenian ${
                    isActive(item.href)
                      ? 'text-edu-blue bg-edu-light-blue'
                      : 'text-gray-600 hover:text-edu-blue hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="px-4 py-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-armenian">Լեզու</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-4 py-2 space-y-2">
                <Link to="/login" className="block w-full">
                  <Button variant="ghost" className="w-full font-armenian">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" className="block w-full">
                  <Button className="w-full bg-edu-blue hover:bg-edu-dark-blue font-armenian">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
