
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useAdminRole();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const { toggleSidebar, isMobile, state } = useSidebar();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && user && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  // Dispatch custom event when section changes
  useEffect(() => {
    const event = new CustomEvent('adminSectionChange', { detail: activeSection });
    window.dispatchEvent(event);
  }, [activeSection]);

  // Keyboard shortcut for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent/5 relative overflow-hidden px-4 sm:px-6">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/5 via-transparent to-edu-purple/5 animate-blob" />
        <div className="absolute inset-0 bg-gradient-to-tl from-edu-orange/5 via-transparent to-edu-light-blue/5 animate-blob animation-delay-2000" />
        
        <div className="text-center space-y-3 sm:space-y-4 relative z-10 max-w-xs sm:max-w-sm">
          <div className="relative">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin mx-auto text-edu-blue drop-shadow-lg" />
            <div className="absolute inset-0 h-10 w-10 sm:h-12 sm:w-12 mx-auto border-2 border-edu-blue/20 rounded-full animate-pulse" />
          </div>
          <p className="text-muted-foreground font-armenian text-base sm:text-lg backdrop-blur-sm bg-background/50 px-3 sm:px-4 py-2 rounded-lg">
            Բեռնում...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const isCollapsed = state === 'collapsed';

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/98 to-accent/3 page-container relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/3 via-transparent to-edu-purple/3 animate-blob" />
      <div className="absolute inset-0 bg-gradient-to-tl from-edu-orange/2 via-transparent to-edu-light-blue/3 animate-blob animation-delay-4000" />
      
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <SidebarInset className={`
        flex-1 min-w-0 transition-all duration-300 ease-out relative z-10
        ${!isMobile ? (isCollapsed 
          ? 'ml-12 sm:ml-14 md:ml-16' 
          : 'ml-72 sm:ml-76 md:ml-80'  
        ) : 'ml-0'}
      `}>
        {/* Ultra responsive Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-gradient-to-r from-background/90 via-background/95 to-background/90 backdrop-blur-xl border-b border-border/30 p-3 sm:p-4 md:hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-edu-blue/5 via-transparent to-edu-purple/5" />
            <div className="flex items-center justify-between relative z-10">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-accent/80 transition-all duration-200 rounded-xl hover:scale-105 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <h1 className="text-base sm:text-lg font-semibold font-armenian bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Ադմին վահանակ
              </h1>
              <div className="w-10 sm:w-11" />
            </div>
          </div>
        )}
        
        <Header />
        <main className={`
          flex-1 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 overflow-auto transition-all duration-300 relative
          ${!isMobile ? 'min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)]' : 'min-h-[calc(100vh-10rem)] sm:min-h-[calc(100vh-12rem)]'}
        `}>
          <div className="animate-fade-in max-w-full relative z-10">
            <AdminDashboard />
          </div>
        </main>
        <Footer />
      </SidebarInset>
      
      {/* Enhanced Mobile Overlay */}
      {isMobile && state === 'expanded' && (
        <div 
          className="fixed inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const Admin = () => {
  return (
    <SidebarProvider 
      defaultOpen={true}
      style={{
        '--sidebar-width': 'clamp(18rem, 20vw, 22rem)',
        '--sidebar-width-mobile': 'clamp(20rem, 85vw, 24rem)',
        '--sidebar-width-icon': 'clamp(3.5rem, 4vw, 4.5rem)'
      } as React.CSSProperties}
    >
      <AdminContent />
    </SidebarProvider>
  );
};

export default Admin;
