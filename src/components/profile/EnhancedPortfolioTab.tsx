
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus, Loader2 } from 'lucide-react';
import { usePortfolios, useAddPortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/hooks/usePortfolios';
import { toast } from 'sonner';
import PortfolioForm from './portfolio/PortfolioForm';
import PortfolioCard from './portfolio/PortfolioCard';
import EmptyPortfolioState from './portfolio/EmptyPortfolioState';

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
    instructor_review: '',
    employer_review: '',
    image_url: '',
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
      instructor_review: '',
      employer_review: '',
      image_url: '',
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
      instructor_review: portfolio.instructor_review || '',
      employer_review: portfolio.employer_review || '',
      image_url: portfolio.image_url || '',
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
            <PortfolioForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              isSubmitting={addPortfolioMutation.isPending || updatePortfolioMutation.isPending}
              isEditing={!!editingId}
            />
          )}

          <div className="grid gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {portfolios.length === 0 && !isAdding && (
            <EmptyPortfolioState onAddFirst={() => setIsAdding(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPortfolioTab;
