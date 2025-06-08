
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  FolderOpen, 
  Plus, 
  ExternalLink, 
  Github, 
  FileText, 
  Calendar,
  Users,
  GraduationCap,
  Star,
  Briefcase,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { usePortfolios, useAddPortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/hooks/usePortfolios';
import { toast } from 'sonner';

const EnhancedPortfolioTab = () => {
  const { data: portfolios = [], isLoading } = usePortfolios();
  const addPortfolioMutation = useAddPortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_url: '',
    github_url: '',
    files_url: '',
    start_date: '',
    end_date: '',
    is_team_project: false,
    is_thesis_project: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      project_url: '',
      github_url: '',
      files_url: '',
      start_date: '',
      end_date: '',
      is_team_project: false,
      is_thesis_project: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Ծրագրի անունը պարտադիր է');
      return;
    }

    try {
      if (editingId) {
        await updatePortfolioMutation.mutateAsync({ id: editingId, ...formData });
        toast.success('Պորտֆոլիոն հաջողությամբ թարմացվեց');
      } else {
        await addPortfolioMutation.mutateAsync(formData);
        toast.success('Պորտֆոլիոն հաջողությամբ ավելացվեց');
      }
      resetForm();
    } catch (error) {
      toast.error('Սխալ տվյալները պահպանելիս');
    }
  };

  const handleEdit = (portfolio: any) => {
    setFormData({
      title: portfolio.title || '',
      description: portfolio.description || '',
      project_url: portfolio.project_url || '',
      github_url: portfolio.github_url || '',
      files_url: portfolio.files_url || '',
      start_date: portfolio.start_date || '',
      end_date: portfolio.end_date || '',
      is_team_project: portfolio.is_team_project || false,
      is_thesis_project: portfolio.is_thesis_project || false,
    });
    setEditingId(portfolio.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս ծրագիրը:')) {
      try {
        await deletePortfolioMutation.mutateAsync(id);
        toast.success('Ծրագիրը հաջողությամբ ջնջվեց');
      } catch (error) {
        toast.error('Սխալ ծրագիրը ջնջելիս');
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-armenian flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Պորտֆոլիո և ծրագրեր
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="font-armenian"
            disabled={isAdding}
          >
            <Plus className="w-4 h-4 mr-2" />
            Նոր ծրագիր
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {(isAdding || editingId) && (
            <Card className="p-4 border-dashed">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Ծրագրի անունը *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Սկսման ամսաթիվ"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                    <Input
                      type="date"
                      placeholder="Ավարտման ամսաթիվ"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <Textarea
                  placeholder="Ծրագրի նկարագրությունը"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Ծրագրի URL"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  />
                  <Input
                    placeholder="GitHub URL"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  />
                  <Input
                    placeholder="Ֆայլերի URL"
                    value={formData.files_url}
                    onChange={(e) => setFormData({ ...formData, files_url: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="team-project"
                      checked={formData.is_team_project}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_team_project: checked })}
                    />
                    <Label htmlFor="team-project" className="text-sm font-armenian">
                      Թիմային ծրագիր
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="thesis-project"
                      checked={formData.is_thesis_project}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_thesis_project: checked })}
                    />
                    <Label htmlFor="thesis-project" className="text-sm font-armenian">
                      Դիպլոմային աշխատանք
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit}
                    disabled={addPortfolioMutation.isPending || updatePortfolioMutation.isPending}
                  >
                    {(addPortfolioMutation.isPending || updatePortfolioMutation.isPending) ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {editingId ? 'Թարմացնել' : 'Ավելացնել'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    disabled={addPortfolioMutation.isPending || updatePortfolioMutation.isPending}
                  >
                    Չեղարկել
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="relative overflow-hidden">
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
                        onClick={() => handleEdit(portfolio)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(portfolio.id)}
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
                        <a href={portfolio.files_url} target="_blank" rel="noopener noreferrer">
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
            ))}
          </div>

          {portfolios.length === 0 && !isAdding && (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2 font-armenian">Ծրագրեր չեն ավելացվել</h3>
              <p className="text-sm mb-4">Ավելացրեք ձեր ծրագրերը՝ պորտֆոլիոն ցուցադրելու համար</p>
              <Button onClick={() => setIsAdding(true)} className="font-armenian">
                <Plus className="w-4 h-4 mr-2" />
                Ավելացնել առաջին ծրագիրը
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPortfolioTab;
