
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-card flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-primary font-armenian">
              {t('hero.title')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.home')}
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.courses')}
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.about')}
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.contact')}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white">
                  <span className="mr-2">{currentLang?.flag}</span>
                  <span className="hidden sm:inline">{currentLang?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
              <Button size="sm" className="bg-edu-blue hover:bg-edu-dark-blue">
                {t('nav.register')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <a href="#" className="block py-2 text-foreground hover:text-primary transition-colors">
              {t('nav.home')}
            </a>
            <a href="#" className="block py-2 text-foreground hover:text-primary transition-colors">
              {t('nav.courses')}
            </a>
            <a href="#" className="block py-2 text-foreground hover:text-primary transition-colors">
              {t('nav.about')}
            </a>
            <a href="#" className="block py-2 text-foreground hover:text-primary transition-colors">
              {t('nav.contact')}
            </a>
            <div className="pt-4 border-t space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                {t('nav.login')}
              </Button>
              <Button size="sm" className="w-full bg-edu-blue hover:bg-edu-dark-blue">
                {t('nav.register')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
