import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Briefcase, FolderKanban, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/specialties', icon: GraduationCap, label: t('nav.specialties') },
    { path: '/jobs', icon: Briefcase, label: t('nav.jobs') },
    { path: '/projects', icon: FolderKanban, label: '\u0546\u0561\u056D\u0561\u0563\u056E\u0565\u0580' },
    { path: '/dashboard', icon: User, label: '\u054A\u0580\u0578\u0586\u056B\u056C' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Hide on admin, partner, auth pages
  const hiddenPaths = ['/admin', '/partner', '/auth', '/reset-password'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />
      
      <div className="relative flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[48px] transition-all duration-200",
                active ? "text-edu-blue" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200",
                active && "bg-edu-blue/10"
              )}>
                <item.icon className={cn("w-5 h-5", active && "scale-110")} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                "text-[10px] font-armenian leading-tight",
                active ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;