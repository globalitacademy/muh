
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
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const navigate = useNavigate();

  console.log('Dashboard - Auth loading:', authLoading);
  console.log('Dashboard - User:', user);
  console.log('Dashboard - Profile loading:', profileLoading);
  console.log('Dashboard - Profile data:', profile);
  console.log('Dashboard - Profile error:', profileError);

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('Dashboard - No user, redirecting to auth');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    console.log('Dashboard - Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard - No user found, returning null');
    return null;
  }

  if (!profile) {
    console.log('Dashboard - No profile found, showing fallback');
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
              <p>Your profile could not be loaded. Please contact support.</p>
              <p className="text-sm text-muted-foreground mt-2">User ID: {user.id}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderProfileByRole = () => {
    console.log('Dashboard - Rendering profile for role:', profile.role);
    switch (profile.role) {
      case 'student':
        return <StudentProfile />;
      case 'instructor':
        return <InstructorProfile />;
      case 'employer':
        return <EmployerProfile />;
      default:
        console.log('Dashboard - Unknown role, defaulting to StudentProfile');
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
