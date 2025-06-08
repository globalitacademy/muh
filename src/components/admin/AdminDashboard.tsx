
import React, { useState, useEffect } from 'react';
import AdminOverviewTab from './overview/AdminOverviewTab';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import AdminReportsTab from './AdminReportsTab';
import AdminModulesTab from './AdminModulesTab';
import AdminSpecialtiesTab from './AdminSpecialtiesTab';
import AdminTopicsTab from './AdminTopicsTab';
import AdminCurriculumTab from './curriculum/AdminCurriculumTab';
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
      case 'modules':
        return <AdminModulesTab />;
      case 'topics':
        return <AdminTopicsTab />;
      case 'curriculum':
        return <AdminCurriculumTab />;
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
    <div className="container mx-auto">
      {renderActiveSection()}
    </div>
  );
};

export default AdminDashboard;
