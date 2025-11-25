
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopicBasicInfoTab from './TopicBasicInfoTab';
import TopicExercisesTab from './TopicExercisesTab';
import TopicQuizTab from './TopicQuizTab';
import TopicContentSections, { ContentSection } from './TopicContentSections';

interface FormData {
  title: string;
  title_en: string;
  title_ru: string;
  description: string;
  description_en: string;
  description_ru: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  exercises: string;
  resources: string;
  quiz_questions: string;
}

interface TopicFormTabsProps {
  formData: FormData;
  onFormDataChange: (updates: Partial<FormData>) => void;
  contentSections: ContentSection[];
  onContentSectionsChange: (sections: ContentSection[]) => void;
}

const TopicFormTabs = ({ 
  formData, 
  onFormDataChange, 
  contentSections, 
  onContentSectionsChange 
}: TopicFormTabsProps) => {
  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic" className="font-armenian">Հիմնական</TabsTrigger>
        <TabsTrigger value="content" className="font-armenian">Բովանդակություն</TabsTrigger>
        <TabsTrigger value="exercises" className="font-armenian">Վարժություններ</TabsTrigger>
        <TabsTrigger value="quiz" className="font-armenian">Վիկտորինա</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <TopicBasicInfoTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <TopicContentSections
          sections={contentSections}
          onChange={onContentSectionsChange}
          topicTitle={formData.title}
        />
      </TabsContent>

      <TabsContent value="exercises" className="space-y-4">
        <TopicExercisesTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>

      <TabsContent value="quiz" className="space-y-4">
        <TopicQuizTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TopicFormTabs;
