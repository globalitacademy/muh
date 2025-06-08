
import React, { useState } from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Loader2 } from 'lucide-react';

// Import all tab components
import AdminModulesTab from './AdminModulesTab';
import AdminUsersTab from './AdminUsersTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import AdminReportsTab from './AdminReportsTab';
import AdminLogsTab from './AdminLogsTab';
import AdminUserActivityTab from './AdminUserActivityTab';
import AdminCurriculumTab from './curriculum/AdminCurriculumTab';
import AdminAssessmentTab from './assessment/AdminAssessmentTab';
import AdminResourcesTab from './resources/AdminResourcesTab';
import AdminPermissionsTab from './users/AdminPermissionsTab';

// Import new components for missing sections
import AdminFinanceTab from './finance/AdminFinanceTab';
import AdminCertificatesTab from './certificates/AdminCertificatesTab';
import AdminCommunicationTab from './communication/AdminCommunicationTab';
import AdminArchiveTab from './archive/AdminArchiveTab';
import AdminOverviewTab from './overview/AdminOverviewTab';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { data: isAdmin, isLoading, error } = useAdminRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">Մուտքի սխալ</h2>
        <p className="text-muted-foreground font-armenian">
          Դուք չունեք ադմինիստրատորի թույլտվություններ
        </p>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'analytics':
        return <AdminAnalyticsTab />;
      case 'reports':
        return <AdminReportsTab />;
      case 'modules':
        return <AdminModulesTab />;
      case 'curriculum':
        return <AdminCurriculumTab />;
      case 'assessment':
        return <AdminAssessmentTab />;
      case 'users':
        return <AdminUsersTab />;
      case 'permissions':
        return <AdminPermissionsTab />;
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

  // This component will be controlled by the sidebar
  React.useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('adminSectionChange', handleSectionChange as EventListener);
    return () => window.removeEventListener('adminSectionChange', handleSectionChange as EventListener);
  }, []);

  return (
    <div className="min-h-[600px]">
      {renderActiveSection()}
    </div>
  );
};

export default AdminDashboard;
