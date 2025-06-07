
import React from 'react';
import { useInstructorDashboard } from '@/hooks/useInstructorDashboard';
import InstructorDashboardStats from './InstructorDashboardStats';
import StudentProgressTable from './StudentProgressTable';
import CoursePerformanceChart from './CoursePerformanceChart';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

const InstructorDashboardMain = () => {
  const { data: dashboardData, isLoading, error } = useInstructorDashboard();

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">Սխալ</h2>
        <p className="text-muted-foreground font-armenian">
          Dashboard-ի տվյալները բեռնելու ժամանակ առաջացել է սխալ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-armenian">Դասախոսի Dashboard</h1>
          <p className="text-muted-foreground font-armenian">
            Կառավարեք ձեր դասընթացները և հետևեք ուսանողների առաջընթացին
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <InstructorDashboardStats 
        stats={dashboardData?.stats || {
          totalCourses: 0,
          activeCourses: 0,
          totalStudents: 0,
          totalRevenue: 0,
          averageRating: 0,
          completionRate: 0
        }} 
        isLoading={isLoading} 
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course Performance */}
        <div className="lg:col-span-2 space-y-6">
          <CoursePerformanceChart 
            courses={dashboardData?.coursePerformance || []} 
            isLoading={isLoading} 
          />
          
          <StudentProgressTable 
            students={dashboardData?.studentProgress || []} 
            isLoading={isLoading} 
          />
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-6">
          <RecentActivity 
            recentActivity={dashboardData?.recentActivity || []} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardMain;
