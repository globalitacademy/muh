
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';

const Footer = () => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden py-16 bg-gradient-to-br from-edu-blue/5 via-background to-edu-purple/5 w-full">
      <div className="content-container">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={resolvedTheme === 'dark' ? logoDark : logoLight}
                alt="LearnHub"
                className="h-10" />

            </div>
            <p className="text-muted-foreground mb-8 max-w-md font-armenian leading-relaxed text-lg">
              {t('footer.description')}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-edu-blue hover:text-white transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-edu-blue hover:text-white transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-edu-blue hover:text-white transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-armenian text-foreground">
              {t('footer.quick-links')}
            </h3>
            <ul className="space-y-4">
              <li className="text-left">
                <a href="#" className="text-muted-foreground hover:text-edu-blue transition-colors font-armenian text-lg hover:translate-x-1 inline-block transition-transform">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-edu-blue transition-colors font-armenian text-lg hover:translate-x-1 inline-block transition-transform">
                  {t('nav.courses')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-edu-blue transition-colors font-armenian text-lg hover:translate-x-1 inline-block transition-transform">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-edu-blue transition-colors font-armenian text-lg hover:translate-x-1 inline-block transition-transform">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-armenian text-foreground">
              {t('footer.contact-info')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4 group-hover:bg-edu-blue group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-muted-foreground font-armenian">info@gitest.am</p>
                </div>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4 group-hover:bg-edu-blue group-hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-muted-foreground font-armenian">+374 (98) 960-959</p>
                </div>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4 group-hover:bg-edu-blue group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-muted-foreground font-armenian">
                    Երևան, Հայաստան
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border pt-8 pb-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground font-armenian text-center md:text-left">
              © 2025 {t('hero.title')}. {t('footer.rights')}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-edu-blue transition-colors font-armenian">
                Գաղտնիության քաղաքականություն
              </a>
              <a href="#" className="text-muted-foreground hover:text-edu-blue transition-colors font-armenian">
                Օգտագործման պայմաններ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;