
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
import { AdminAccessCodesTab } from './access-codes/AdminAccessCodesTab';
import { AdminProjectsTab } from './projects/AdminProjectsTab';


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
      case 'projects':
        return <AdminProjectsTab />;
      case 'assessment':
        return <AdminAssessmentTab />;
      case 'applications':
        return <AdminApplicationsTab />;
      case 'users':
        return <AdminUsersTab />;
      case 'access-codes':
        return <AdminAccessCodesTab />;
      case 'finance':
        return <AdminFinanceTab />;
      case 'certificates':
        return <AdminCertificatesTab />;
      case 'communication':
        return <AdminCommunicationTab />;
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
    <div className="container mx-auto max-w-none px-0 relative">
      {/* Enhanced background with subtle animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent pointer-events-none animate-pulse-slow" />
      
      <div className="overflow-hidden relative z-10">
        <div className="transition-all duration-500 ease-out">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
