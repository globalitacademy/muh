
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentProfile from '@/components/profiles/StudentProfile';
import InstructorProfile from '@/components/profiles/InstructorProfile';
import EmployerProfile from '@/components/profiles/EmployerProfile';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const renderProfileByRole = () => {
    switch (profile.role) {
      case 'student':
        return <StudentProfile />;
      case 'instructor':
        return <InstructorProfile />;
      case 'employer':
        return <EmployerProfile />;
      default:
        return <StudentProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {renderProfileByRole()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
