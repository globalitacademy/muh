
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Edit, Trash2, Lock, Unlock, Clock, Plus, FileText, HelpCircle, Link } from 'lucide-react';
import { useTopics } from '@/hooks/useTopics';
import { useDeleteTopic } from '@/hooks/useAdminTopics';
import { Topic } from '@/types/database';
import TopicFormDialog from './TopicFormDialog';

interface SpecialtyTopicsListProps {
  moduleId: string;
}

const SpecialtyTopicsList = ({ moduleId }: SpecialtyTopicsListProps) => {
  const { data: topics, isLoading } = useTopics(moduleId);
  const deleteTopic = useDeleteTopic();
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleAddTopic = () => {
    setEditingTopic(null);
    setIsFormOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setIsFormOpen(true);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս թեման:')) {
      await deleteTopic.mutateAsync(topicId);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTopic(null);
  };

  if (isLoading) {
    return <div className="text-center py-4 font-armenian">Բեռնում...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium font-armenian">
          Թեմաներ և դասեր ({topics?.length || 0})
        </h4>
        <Button onClick={handleAddTopic} size="sm" className="font-armenian">
          <Plus className="w-4 h-4 mr-1" />
          Նոր թեմա
        </Button>
      </div>

      {!topics || topics.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground font-armenian">
          Այս մոդուլում դեռ թեմաներ չկան
        </div>
      ) : (
        <div className="space-y-2">
          {topics.map((topic, index) => {
            const isExpanded = expandedTopics.has(topic.id);
            return (
              <Card key={topic.id} className="border-l-4 border-l-blue-500">
                <Collapsible open={isExpanded} onOpenChange={() => toggleTopic(topic.id)}>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-blue-600 min-w-[2rem]">
                            {index + 1}.
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          <div className="flex items-center gap-2">
                            {topic.is_free ? (
                              <Unlock className="w-4 h-4 text-green-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-orange-600" />
                            )}
                            <span className="font-medium font-armenian">{topic.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Badge variant={topic.is_free ? 'secondary' : 'default'}>
                            {topic.is_free ? 'Անվճար' : 'Վճարովի'}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {topic.duration_minutes}ր
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTopic(topic)}
                            className="font-armenian"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Խմբագրել
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="font-armenian"
                            disabled={deleteTopic.isPending}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Ջնջել
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-4 pl-12">
                      {topic.description && (
                        <p className="text-sm text-muted-foreground mb-3 font-armenian">
                          {topic.description}
                        </p>
                      )}
                      
                      {topic.video_url && (
                        <div className="mb-3 flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          <span className="text-sm font-medium font-armenian">Վիդեո:</span>
                          <a 
                            href={topic.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Դիտել վիդեոն
                          </a>
                        </div>
                      )}
                      
                      {topic.content && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium font-armenian">Բովանդակություն:</span>
                          </div>
                          <div className="p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {topic.content.substring(0, 300)}
                            {topic.content.length > 300 && '...'}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {topic.exercises && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span className="font-armenian">Վարժություններ</span>
                          </div>
                        )}
                        {topic.quiz_questions && (
                          <div className="flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            <span className="font-armenian">Վիկտորինա</span>
                          </div>
                        )}
                        {topic.resources && (
                          <div className="flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            <span className="font-armenian">Ռեսուրսներ</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}

      <TopicFormDialog
        isOpen={isFormOpen}
        onClose={closeForm}
        moduleId={moduleId}
        editingTopic={editingTopic}
      />
    </div>
  );
};

export default SpecialtyTopicsList;
