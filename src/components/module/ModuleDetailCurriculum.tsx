
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Topic } from '@/types/database';
import TopicCurriculum from '@/components/TopicCurriculum';

interface ModuleDetailCurriculumProps {
  topics: Topic[] | undefined;
  hasFullAccess: boolean;
  onTopicClick: (topicId: string) => void;
}

const ModuleDetailCurriculum = ({ topics, hasFullAccess, onTopicClick }: ModuleDetailCurriculumProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold font-armenian mb-6 flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-edu-blue" />
        Դասընթացի ծրագիր
      </h2>
      
      {topics && topics.length > 0 ? (
        <TopicCurriculum
          topics={topics}
          hasFullAccess={hasFullAccess}
          onTopicClick={onTopicClick}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-armenian">
              Դասերը շուտով կլինեն հասանելի
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleDetailCurriculum;
