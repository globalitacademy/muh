import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobPostings } from '@/hooks/useJobPostings';
import { useMyProjects } from '@/hooks/useProjects';
import { MapPin, Building, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const JobPostingsSection = () => {
  const { data: jobPostings, isLoading: jobsLoading } = useJobPostings();
  const { data: projects, isLoading: projectsLoading } = useMyProjects();

  const isLoading = jobsLoading || projectsLoading;

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center font-armenian">Բեռնվում է...</div>
        </div>
      </section>
    );
  }

  // Convert projects to job posting format
  const projectsAsPostings = projects?.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description || '',
    posting_type: 'project' as const,
    location: null,
    is_remote: false,
    created_at: project.created_at,
    expires_at: project.application_deadline,
    salary_range: null,
    requirements: project.required_skills?.join(', '),
    profiles: null,
    isProject: true,
    employer_id: project.creator_id,
    is_active: true,
    updated_at: project.updated_at,
    image_url: project.image_url
  })) || [];

  // Combine job postings and projects  
  const regularJobPostings = (jobPostings || []).map(posting => ({
    ...posting,
    isProject: false
  }));
  
  const allPostings = [...regularJobPostings, ...projectsAsPostings];
  const featuredPostings = allPostings.slice(0, 3) || [];

  if (featuredPostings.length === 0) {
    return null;
  }

  const getPostingTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Աշխատանք';
      case 'internship': return 'Պրակտիկա';
      case 'project': return 'Նախագիծ';
      default: return type;
    }
  };

  const getPostingTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-primary text-primary-foreground';
      case 'internship': return 'bg-secondary text-secondary-foreground';
      case 'project': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-armenian mb-4 text-foreground">
            Գործատուների առաջարկներ
          </h2>
          <p className="text-lg text-muted-foreground font-armenian max-w-2xl mx-auto">
            Գտեք ձեր մասնագիտությանը համապատասխան աշխատանքներ, պրակտիկաներ և նախագծեր
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredPostings.map((posting) => (
            <Card key={posting.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-muted/50">
              {(posting as any).image_url && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={(posting as any).image_url} 
                    alt={posting.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`${getPostingTypeColor(posting.posting_type)} font-armenian`}>
                    {getPostingTypeLabel(posting.posting_type)}
                  </Badge>
                  {posting.is_remote && (
                    <Badge variant="outline" className="font-armenian">
                      Հեռակա
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-armenian text-xl group-hover:text-primary transition-colors">
                  {posting.title}
                </CardTitle>
                {posting.profiles?.organization && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{posting.profiles.organization}</span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                {posting.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {posting.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {posting.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{posting.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(posting.created_at), 'dd/MM/yyyy')}</span>
                  </div>
                </div>

                {posting.salary_range && (
                  <div className="font-medium text-primary text-sm">
                    {posting.salary_range === "0" || posting.salary_range === "0 դրամ" ? "անվճար" : posting.salary_range}
                  </div>
                )}
                
                 <div className="pt-3">
                   <Link to={(posting as any).isProject ? `/projects/${posting.id}` : `/job/${posting.id}`}>
                     <Button 
                       size="sm" 
                       className="w-full font-armenian"
                     >
                       Դիտել մանրամասն
                     </Button>
                   </Link>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/jobs">
            <Button size="lg" className="font-armenian group">
              Բոլոր առաջարկները
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobPostingsSection;