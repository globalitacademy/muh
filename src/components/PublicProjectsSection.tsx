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
      <section className="py-20 bg-secondary/30">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">Բաց նախագծեր</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Մասնակցեք հետաքրքիր նախագծերի և զարգացրեք ձեր հմտությունները
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) =>
            <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>);

  }

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="content-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FolderKanban className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Բաց նախագծեր</span>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-4">Հանրային նախագծեր</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Մասնակցեք հետաքրքիր նախագծերի և զարգացրեք ձեր հմտությունները
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {featuredProjects.map((project) =>
          <Card key={project.id} className="modern-card group hover:shadow-lg transition-all duration-300">
              {project.image_url &&
            <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                  <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                </div>
            }
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  {project.category &&
                <Badge variant="secondary" className="shrink-0">
                      {project.category}
                    </Badge>
                }
                </div>
                {project.description &&
              <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
              }
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.created_at).toLocaleDateString('hy-AM')}</span>
                  </div>
                  {project.max_applicants &&
                <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>մինչև {project.max_applicants}</span>
                    </div>
                }
                </div>

                {project.required_skills && project.required_skills.length > 0 &&
              <div className="flex flex-wrap gap-1">
                    {project.required_skills.slice(0, 3).map((skill) =>
                <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                )}
                    {project.required_skills.length > 3 &&
                <Badge variant="outline" className="text-xs">
                        +{project.required_skills.length - 3}
                      </Badge>
                }
                  </div>
              }

                <Button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="w-full btn-modern group bg-primary-foreground">

                  Մանրամասները
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {projects.length > 3 &&
        <div className="text-center">
            <Button
            onClick={() => navigate('/projects')}
            variant="outline"
            size="lg"
            className="btn-modern">

              Բոլոր նախագծերը
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        }
      </div>
    </section>);

};

export default PublicProjectsSection;