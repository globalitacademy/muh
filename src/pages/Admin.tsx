
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { Loader2, Menu, PanelLeft } from 'lucide-react';
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

  // Debug logging for sidebar state
  useEffect(() => {
    console.log('Sidebar state changed:', state, 'isMobile:', isMobile);
  }, [state, isMobile]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-edu-blue" />
          <p className="text-muted-foreground font-armenian">Բեռնում...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const isCollapsed = state === 'collapsed';

  return (
    <div className="min-h-screen flex w-full bg-background page-container relative">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset className={`
        flex-1 min-w-0 transition-all duration-150 ease-out relative
        ${!isMobile ? (isCollapsed 
          ? 'ml-16' // Account for collapsed sidebar width (4rem)
          : 'ml-80'  // Account for expanded sidebar width (20rem)
        ) : 'ml-0'}
      `}>
        {/* Mobile Header with Sidebar Toggle */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/30 p-4 md:hidden">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-accent transition-colors duration-150"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold font-armenian">
                Ադմին վահանակ
              </h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>
        )}

        {/* Desktop Header Toggle - NEW */}
        {!isMobile && (
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/20 p-2 hidden md:flex">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleSidebar}
              className="hover:bg-accent transition-colors duration-150 flex items-center gap-2"
            >
              <PanelLeft className="h-4 w-4" />
              <span className="text-sm font-armenian">
                {isCollapsed ? 'Բացել մենյուն' : 'Փակել մենյուն'}
              </span>
            </Button>
          </div>
        )}
        
        <Header />
        <main className={`
          flex-1 p-3 sm:p-4 lg:p-6 overflow-auto transition-all duration-150
          ${!isMobile ? 'min-h-[calc(100vh-8rem)]' : 'min-h-[calc(100vh-12rem)]'}
        `}>
          <div className="animate-fade-in max-w-full">
            <AdminDashboard />
          </div>
        </main>
        <Footer />
      </SidebarInset>
      
      {/* Mobile Overlay - improved positioning and z-index */}
      {isMobile && state === 'expanded' && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-150"
          onClick={toggleSidebar}
        />
      )}

      {/* Enhanced Floating Toggle Button - NEW */}
      <EnhancedFloatingToggleButton isCollapsed={isCollapsed} isMobile={isMobile} />
    </div>
  );
};

// Enhanced floating toggle button component with debugging
const EnhancedFloatingToggleButton = ({ 
  isCollapsed, 
  isMobile 
}: { 
  isCollapsed: boolean; 
  isMobile: boolean; 
}) => {
  const { toggleSidebar } = useSidebar();
  
  console.log('FloatingToggleButton rendered:', { isCollapsed, isMobile });
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={`
        fixed z-[9999] transition-all duration-300 rounded-xl shadow-lg border-2
        ${isCollapsed ? [
          'bottom-6 right-6 h-14 w-14',
          'bg-edu-blue/90 backdrop-blur-md border-edu-blue/30',
          'hover:bg-edu-blue hover:shadow-xl hover:scale-110',
          'text-white'
        ] : [
          'bottom-4 right-4 h-12 w-12',
          'bg-background/95 backdrop-blur-sm border-border/40',
          'hover:bg-sidebar-accent hover:border-edu-blue/30 hover:shadow-md hover:scale-105'
        ]}
        focus-visible:ring-2 focus-visible:ring-edu-blue focus-visible:ring-offset-2 focus-visible:outline-none
        active:scale-95
        ${!isMobile ? 'block' : 'hidden md:block'}
      `}
      style={{
        // Force visibility for debugging
        display: 'flex !important',
        position: 'fixed',
        zIndex: 9999,
        // Add bright background for debugging
        backgroundColor: isCollapsed ? '#3b82f6' : '#f3f4f6',
        border: '2px solid #ef4444'
      }}
    >
      {isCollapsed ? (
        <PanelLeft className="h-6 w-6 text-white" />
      ) : (
        <PanelLeft className="h-5 w-5 text-foreground/80 rotate-180" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

const Admin = () => {
  return (
    <SidebarProvider 
      defaultOpen={true}
      style={{
        '--sidebar-width': '20rem',
        '--sidebar-width-mobile': '22rem',
        '--sidebar-width-icon': '4rem'
      } as React.CSSProperties}
    >
      <AdminContent />
    </SidebarProvider>
  );
};

export default Admin;
