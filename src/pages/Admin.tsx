
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
  const { toggleSidebar, isMobile } = useSidebar();

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

  return (
    <div className="min-h-screen flex w-full bg-background page-container relative">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset className="flex-1 min-w-0 transition-all duration-150 ease-out">
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
        
        <Header />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto transition-all duration-200">
          <div className="animate-fade-in">
            <AdminDashboard />
          </div>
        </main>
        <Footer />
      </SidebarInset>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-200"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const Admin = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminContent />
    </SidebarProvider>
  );
};

export default Admin;
