
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Edit, Trash2, Play, Lock, Unlock, Clock } from 'lucide-react';
import { useTopics } from '@/hooks/useTopics';
import { Topic } from '@/types/database';

interface SpecialtyTopicsListProps {
  moduleId: string;
}

const SpecialtyTopicsList = ({ moduleId }: SpecialtyTopicsListProps) => {
  const { data: topics, isLoading } = useTopics(moduleId);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleEditTopic = (topic: Topic) => {
    // TODO: Implement topic editing
    console.log('Edit topic:', topic);
  };

  const handleDeleteTopic = (topicId: string) => {
    // TODO: Implement topic deletion
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս թեման:')) {
      console.log('Delete topic:', topicId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 font-armenian">Բեռնում...</div>;
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground font-armenian">
        Այս մոդուլում դեռ թեմաներ չկան
      </div>
    );
  }

  return (
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
                      <span className="text-sm font-medium text-blue-600">
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
                    <div className="mb-3">
                      <span className="text-sm font-medium font-armenian">Վիդեո:</span>
                      <a 
                        href={topic.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        Դիտել վիդեոն
                      </a>
                    </div>
                  )}
                  {topic.content && (
                    <div className="mb-3">
                      <span className="text-sm font-medium font-armenian">Բովանդակություն:</span>
                      <div className="mt-1 p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                        {topic.content.substring(0, 200)}
                        {topic.content.length > 200 && '...'}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {topic.exercises && (
                      <span className="font-armenian">Վարժություններ: Այո</span>
                    )}
                    {topic.quiz_questions && (
                      <span className="font-armenian">Վիկտորինա: Այո</span>
                    )}
                    {topic.resources && (
                      <span className="font-armenian">Ռեսուրսներ: Այո</span>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};

export default SpecialtyTopicsList;
