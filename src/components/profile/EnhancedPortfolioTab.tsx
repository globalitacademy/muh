
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortfolios, useCreatePortfolio, useDeletePortfolio } from '@/hooks/usePortfolios';
import { FolderOpen, ExternalLink, Github, Plus, Calendar, Users, GraduationCap, Image, FileText, Star, Heart } from 'lucide-react';

const EnhancedPortfolioTab = () => {
  const { data: portfolios, isLoading } = usePortfolios();
  const createPortfolioMutation = useCreatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    project_url: '',
    github_url: '',
    start_date: '',
    end_date: '',
    is_team_project: false,
    is_thesis_project: false
  });

  const [likedProjects, setLikedProjects] = useState<string[]>([]);

  const handleLike = (projectId: string) => {
    setLikedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const addProject = async () => {
    if (newProject.title && newProject.description) {
      try {
        await createPortfolioMutation.mutateAsync(newProject);
        setNewProject({
          title: '',
          description: '',
          project_url: '',
          github_url: '',
          start_date: '',
          end_date: '',
          is_team_project: false,
          is_thesis_project: false
        });
        setIsAdding(false);
      } catch (error) {
        console.error('Error creating portfolio:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-armenian">Իմ նախագծերը</h2>
          <p className="text-muted-foreground">Ցուցադրեք ձեր ստեղծագործական աշխատանքները</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{portfolios?.length || 0}</p>
            <p className="text-xs text-muted-foreground font-armenian">Նախագծեր</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{portfolios?.filter(p => p.is_team_project).length || 0}</p>
            <p className="text-xs text-muted-foreground font-armenian">Թիմային</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="font-armenian">
            <Plus className="w-4 h-4 mr-2" />
            Ավելացնել նախագիծ
          </Button>
        </div>
      </div>

      {/* Add New Project Form */}
      {isAdding && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="font-armenian">Նոր նախագիծ ավելացնել</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Նախագծի անունը"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="Սկսման ամսաթիվ"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Ավարտի ամսաթիվ"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                />
              </div>
            </div>
            
            <Textarea
              placeholder="Նախագծի նկարագրություն..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={3}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Նախագծի կայքի հղում"
                value={newProject.project_url}
                onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
              />
              <Input
                placeholder="GitHub հղում"
                value={newProject.github_url}
                onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
              />
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProject.is_team_project}
                  onChange={(e) => setNewProject({ ...newProject, is_team_project: e.target.checked })}
                />
                <span className="font-armenian">Թիմային նախագիծ</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProject.is_thesis_project}
                  onChange={(e) => setNewProject({ ...newProject, is_thesis_project: e.target.checked })}
                />
                <span className="font-armenian">Դիպլոմային նախագիծ</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addProject} disabled={createPortfolioMutation.isPending}>
                {createPortfolioMutation.isPending ? 'Ավելացվում է...' : 'Ավելացնել'}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Չեղարկել
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios?.map((portfolio) => (
          <Card key={portfolio.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <FolderOpen className="w-12 h-12 text-primary/30" />
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                {portfolio.is_team_project && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Թիմային
                  </Badge>
                )}
                {portfolio.is_thesis_project && (
                  <Badge variant="secondary" className="text-xs">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Դիպլոմային
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(portfolio.id)}
                  className={`${likedProjects.includes(portfolio.id) ? 'text-red-500' : 'text-white'} hover:bg-white/20`}
                >
                  <Heart className={`w-4 h-4 ${likedProjects.includes(portfolio.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {portfolio.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {portfolio.description}
                </p>
              </div>
              
              {(portfolio.start_date || portfolio.end_date) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {portfolio.start_date && new Date(portfolio.start_date).toLocaleDateString('hy-AM')}
                  {portfolio.start_date && portfolio.end_date && ' - '}
                  {portfolio.end_date && new Date(portfolio.end_date).toLocaleDateString('hy-AM')}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {portfolio.project_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  {portfolio.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs">4.8</span>
                </div>
              </div>

              {(portfolio.instructor_review || portfolio.employer_review) && (
                <div className="space-y-2 pt-2 border-t">
                  {portfolio.instructor_review && (
                    <div className="p-2 bg-blue-50 rounded text-xs">
                      <strong>Դասախոսի գնահատական:</strong> {portfolio.instructor_review}
                    </div>
                  )}
                  {portfolio.employer_review && (
                    <div className="p-2 bg-green-50 rounded text-xs">
                      <strong>Գործատուի գնահատական:</strong> {portfolio.employer_review}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {(!portfolios || portfolios.length === 0) && !isAdding && (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2 font-armenian">Նախագծեր չկան</h3>
            <p className="text-muted-foreground mb-4 font-armenian">
              Ավելացրեք ձեր առաջին նախագիծը՝ պորտֆոլիոն հարստացնելու համար
            </p>
            <Button onClick={() => setIsAdding(true)} className="font-armenian">
              <Plus className="w-4 h-4 mr-2" />
              Ստեղծել առաջին նախագիծը
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPortfolioTab;
