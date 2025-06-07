
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePortfolios, useCreatePortfolio, useDeletePortfolio } from '@/hooks/usePortfolios';
import { FolderOpen, ExternalLink, Github, Plus, Calendar, Users, GraduationCap } from 'lucide-react';

const PortfolioTab = () => {
  const { data: portfolios, isLoading } = usePortfolios();
  const createPortfolioMutation = useCreatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-armenian">Իմ նախագծերը</CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ավելացնել նախագիծ
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolios?.map((portfolio) => (
              <div key={portfolio.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{portfolio.title}</h4>
                    <p className="text-sm text-muted-foreground">{portfolio.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {portfolio.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(portfolio.start_date).toLocaleDateString('hy-AM')}
                          {portfolio.end_date && ` - ${new Date(portfolio.end_date).toLocaleDateString('hy-AM')}`}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {portfolio.is_team_project && (
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        Թիմային
                      </Badge>
                    )}
                    {portfolio.is_thesis_project && (
                      <Badge variant="secondary">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Դիպլոմային
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {portfolio.project_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Կայք
                      </a>
                    </Button>
                  )}
                  {portfolio.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>

                {(portfolio.instructor_review || portfolio.employer_review) && (
                  <div className="mt-3 space-y-2">
                    {portfolio.instructor_review && (
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <strong>Դասախոսի գնահատակан:</strong> {portfolio.instructor_review}
                      </div>
                    )}
                    {portfolio.employer_review && (
                      <div className="p-2 bg-green-50 rounded text-sm">
                        <strong>Գործատուի գնահատակან:</strong> {portfolio.employer_review}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {(!portfolios || portfolios.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Նախագծեր չկան</p>
                <p className="text-sm">Ավելացրեք ձեր առաջին նախագիծը</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;
