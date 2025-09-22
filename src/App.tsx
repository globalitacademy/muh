
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Suspense, lazy } from "react";

// CRITICAL: Keep Index page loaded immediately as it's the landing page
import Index from "./pages/Index";

// LAZY LOAD: Non-critical pages to reduce initial bundle size (430KB savings)
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Courses = lazy(() => import("./pages/Courses"));
const ModuleDetail = lazy(() => import("./pages/ModuleDetail"));
const TopicDetail = lazy(() => import("./pages/TopicDetail"));
const Specialties = lazy(() => import("./pages/Specialties"));
const MyCourses = lazy(() => import("./pages/MyCourses"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const Partner = lazy(() => import("./pages/Partner"));
const PartnerCourseDetail = lazy(() => import("./pages/PartnerCourseDetail"));
const PrivateCourses = lazy(() => import("./pages/PrivateCourses"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

import "./App.css";

const queryClient = new QueryClient();

// Loading component for better UX during code splitting
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  {/* Critical route - loaded immediately */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Non-critical routes - lazy loaded with suspense */}
                  <Route path="/about" element={
                    <Suspense fallback={<PageLoader />}>
                      <About />
                    </Suspense>
                  } />
                  <Route path="/contact" element={
                    <Suspense fallback={<PageLoader />}>
                      <Contact />
                    </Suspense>
                  } />
                  <Route path="/courses" element={
                    <Suspense fallback={<PageLoader />}>
                      <Courses />
                    </Suspense>
                  } />
                  <Route path="/module/:id" element={
                    <Suspense fallback={<PageLoader />}>
                      <ModuleDetail />
                    </Suspense>
                  } />
                  <Route path="/topic/:topicId" element={
                    <Suspense fallback={<PageLoader />}>
                      <TopicDetail />
                    </Suspense>
                  } />
                  <Route path="/specialties" element={
                    <Suspense fallback={<PageLoader />}>
                      <Specialties />
                    </Suspense>
                  } />
                  <Route path="/my-courses" element={
                    <Suspense fallback={<PageLoader />}>
                      <MyCourses />
                    </Suspense>
                  } />
                  <Route path="/dashboard" element={
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="/jobs" element={
                    <Suspense fallback={<PageLoader />}>
                      <Jobs />
                    </Suspense>
                  } />
                  <Route path="/job/:id" element={
                    <Suspense fallback={<PageLoader />}>
                      <JobDetail />
                    </Suspense>
                  } />
                  <Route path="/auth" element={
                    <Suspense fallback={<PageLoader />}>
                      <Auth />
                    </Suspense>
                  } />
                  <Route path="/reset-password" element={
                    <Suspense fallback={<PageLoader />}>
                      <ResetPassword />
                    </Suspense>
                  } />
                  <Route path="/admin" element={
                    <Suspense fallback={<PageLoader />}>
                      <Admin />
                    </Suspense>
                  } />
                  <Route path="/partner" element={
                    <Suspense fallback={<PageLoader />}>
                      <Partner />
                    </Suspense>
                  } />
                  <Route path="/partner-course/:courseId" element={
                    <Suspense fallback={<PageLoader />}>
                      <PartnerCourseDetail />
                    </Suspense>
                  } />
                  <Route path="/private-courses" element={
                    <Suspense fallback={<PageLoader />}>
                      <PrivateCourses />
                    </Suspense>
                  } />
                  <Route path="/projects" element={
                    <Suspense fallback={<PageLoader />}>
                      <Projects />
                    </Suspense>
                  } />
                  <Route path="/projects/:id" element={
                    <Suspense fallback={<PageLoader />}>
                      <ProjectDetail />
                    </Suspense>
                  } />
                  <Route path="*" element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  } />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
