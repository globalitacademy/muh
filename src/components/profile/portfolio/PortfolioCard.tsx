
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  ExternalLink, 
  Github, 
  FileText, 
  Calendar,
  Users,
  GraduationCap,
  Star,
  Briefcase,
  Edit,
  Trash2
} from 'lucide-react';

interface PortfolioCardItem {
  id: string;
  title: string;
  description?: string | null;
  project_url?: string | null;
  github_url?: string | null;
  files_url?: string | string[] | null;
  start_date?: string | null;
  end_date?: string | null;
  is_team_project?: boolean | null;
  is_thesis_project?: boolean | null;
  instructor_review?: string | null;
  employer_review?: string | null;
  image_url?: string | null;
}

interface PortfolioCardProps {
  portfolio: PortfolioCardItem;
  onEdit: (portfolio: PortfolioCardItem) => void;
  onDelete: (id: string) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="relative overflow-hidden">
      {portfolio.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={portfolio.image_url}
            alt={portfolio.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              {portfolio.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {portfolio.is_team_project && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Users className="w-3 h-3 mr-1" />
                  Թիմային
                </Badge>
              )}
              {portfolio.is_thesis_project && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Դիպլոմային
                </Badge>
              )}
              {portfolio.start_date && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(portfolio.start_date).toLocaleDateString('hy-AM')}
                  {portfolio.end_date && ` - ${new Date(portfolio.end_date).toLocaleDateString('hy-AM')}`}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(portfolio)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(portfolio.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {portfolio.description && (
          <p className="text-muted-foreground leading-relaxed">
            {portfolio.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {portfolio.project_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ծրագիր
              </a>
            </Button>
          )}
          {portfolio.github_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {portfolio.files_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={Array.isArray(portfolio.files_url) ? portfolio.files_url[0] : portfolio.files_url} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Ֆայլեր
              </a>
            </Button>
          )}
        </div>

        {(portfolio.instructor_review || portfolio.employer_review) && (
          <div className="border-t pt-4 space-y-3">
            {portfolio.instructor_review && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Դասախոսի գնահատական</span>
                </div>
                <p className="text-sm text-blue-700">{portfolio.instructor_review}</p>
              </div>
            )}
            {portfolio.employer_review && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Գործատուի գնահատական</span>
                </div>
                <p className="text-sm text-green-700">{portfolio.employer_review}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
