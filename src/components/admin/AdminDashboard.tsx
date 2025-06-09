
import React, { useState, useEffect } from 'react';
import AdminOverviewTab from './overview/AdminOverviewTab';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import AdminReportsTab from './AdminReportsTab';
import AdminSpecialtiesTab from './AdminSpecialtiesTab';
import AdminAssessmentTab from './assessment/AdminAssessmentTab';
import AdminApplicationsTab from './applications/AdminApplicationsTab';
import AdminUsersTab from './AdminUsersTab';
import AdminLogsTab from './AdminLogsTab';
import AdminArchiveTab from './archive/AdminArchiveTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminFinanceTab from './finance/AdminFinanceTab';
import AdminCertificatesTab from './certificates/AdminCertificatesTab';
import AdminCommunicationTab from './communication/AdminCommunicationTab';
import AdminResourcesTab from './resources/AdminResourcesTab';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('adminSectionChange', handleSectionChange as EventListener);
    
    return () => {
      window.removeEventListener('adminSectionChange', handleSectionChange as EventListener);
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'analytics':
        return <AdminAnalyticsTab />;
      case 'reports':
        return <AdminReportsTab />;
      case 'specialties':
        return <AdminSpecialtiesTab />;
      case 'assessment':
        return <AdminAssessmentTab />;
      case 'applications':
        return <AdminApplicationsTab />;
      case 'users':
        return <AdminUsersTab />;
      case 'permissions':
        return <AdminUsersTab />;
      case 'finance':
        return <AdminFinanceTab />;
      case 'certificates':
        return <AdminCertificatesTab />;
      case 'communication':
        return <AdminCommunicationTab />;
      case 'resources':
        return <AdminResourcesTab />;
      case 'logs':
        return <AdminLogsTab />;
      case 'archive':
        return <AdminArchiveTab />;
      case 'settings':
        return <AdminSettingsTab />;
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <div className="w-full max-w-none mx-auto relative">
      {/* Enhanced ultra responsive background with subtle animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent pointer-events-none animate-pulse-slow" />
      
      <div className="overflow-hidden relative z-10">
        <div className="transition-all duration-500 ease-out p-0 sm:p-1 md:p-2">
          <div className="bg-gradient-to-br from-background/80 via-card/60 to-background/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-border/30 shadow-2xl transition-all duration-300 hover:shadow-3xl min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-full">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
