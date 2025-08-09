import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, MapPin, Clock, Star, Eye } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onApply?: (projectId: string) => void;
  isApplied?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  showActions = true, 
  onApply,
  isApplied = false 
}) => {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/projects/${project.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green text-white';
      case 'completed': return 'bg-edu-blue text-white';
      case 'cancelled': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isExpired = project.application_deadline && new Date(project.application_deadline) < new Date();

  return (
    <Card className="modern-card hover-interactive group">
      <div className="relative">
        {project.image_url && (
          <div className="h-48 w-full overflow-hidden rounded-t-lg">
            <img
              src={project.image_url}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <Badge className={`absolute top-3 right-3 ${getStatusColor(project.status)}`}>
          {project.status}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-lg leading-6">
            {project.title}
          </CardTitle>
          {project.category && (
            <Badge variant="outline" className="shrink-0">
              {project.category}
            </Badge>
          )}
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {project.start_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Սկսվել է {formatDistanceToNow(new Date(project.start_date), { addSuffix: true })}</span>
            </div>
          )}
          
          {project.max_applicants && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Մինչև {project.max_applicants} մարդ</span>
            </div>
          )}
          
          {project.application_deadline && (
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Clock className="h-4 w-4" />
              <span className={isExpired ? 'text-destructive' : ''}>
                Դիմել մինչև {new Date(project.application_deadline).toLocaleDateString('hy-AM')}
              </span>
            </div>
          )}
        </div>

        {/* Skills */}
        {project.required_skills && project.required_skills.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Անհրաժեշտ հմտություններ</div>
            <div className="flex flex-wrap gap-1">
              {project.required_skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.required_skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.required_skills.length - 3} ավելի
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Creator Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {project.creator_role === 'employer' ? 'E' : 'I'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {project.creator_role === 'employer' ? 'Գործատու' : 'Դասախոս'}
          </span>
          <div className="ml-auto text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleViewProject} className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              Դիտել
            </Button>
            
            {onApply && !isApplied && !isExpired && project.status === 'active' && (
              <Button 
                size="sm" 
                onClick={() => onApply(project.id)}
                className="flex-1 btn-modern"
              >
                Դիմել
              </Button>
            )}
            
            {isApplied && (
              <Badge className="flex-1 justify-center bg-success-green text-white">
                Դիմել եք
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;