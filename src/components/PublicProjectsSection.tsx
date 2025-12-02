import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePublicProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Calendar, Users, ArrowRight } from 'lucide-react';

const PublicProjectsSection = () => {
  const { data: projects = [], isLoading } = usePublicProjects();
  const navigate = useNavigate();

  console.log('PublicProjectsSection - projects:', projects);

  // Take only the first 3 projects for the homepage
  const featuredProjects = projects.slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30 safe-area-inset">
        <div className="content-container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-3 sm:mb-4 px-4">Բաց նախագծեր</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Մասնակցեք հետաքրքիր նախագծերի և զարգացրեք ձեր հմտությունները
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse material-elevation-1">
                <div className="h-40 sm:h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary/30 safe-area-inset">
      <div className="content-container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-3 sm:mb-4 material-elevation-1">
            <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-primary font-medium text-sm sm:text-base">Բաց նախագծեր</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-3 sm:mb-4 px-4">
            Հանրային նախագծեր
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            Մասնակցեք հետաքրքիր նախագծերի և զարգացրեք ձեր հմտությունները
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12">
          {featuredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="material-card material-elevation-2 group hover:material-elevation-4 material-transition overflow-hidden"
            >
              {project.image_url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 material-transition"
                    loading="lazy"
                  />
                </div>
              )}
              <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-base sm:text-lg line-clamp-2 group-hover:text-primary material-transition">
                    {project.title}
                  </CardTitle>
                  {project.category && (
                    <Badge variant="secondary" className="shrink-0 text-xs material-chip">
                      {project.category}
                    </Badge>
                  )}
                </div>
                {project.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{new Date(project.created_at).toLocaleDateString('hy-AM')}</span>
                  </div>
                  {project.max_applicants && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="whitespace-nowrap">մինչև {project.max_applicants}</span>
                    </div>
                  )}
                </div>

                {project.required_skills && project.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.required_skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs material-chip">
                        {skill}
                      </Badge>
                    ))}
                    {project.required_skills.length > 3 && (
                      <Badge variant="outline" className="text-xs material-chip">
                        +{project.required_skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="w-full material-button-filled material-touch group"
                >
                  <span className="text-sm sm:text-base">Մանրամասները</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 material-transition" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length > 3 && (
          <div className="text-center px-4">
            <Button
              onClick={() => navigate('/projects')}
              variant="outline"
              size="lg"
              className="material-button-outlined material-touch w-full sm:w-auto"
            >
              <span className="text-sm sm:text-base">Բոլոր նախագծերը</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicProjectsSection;