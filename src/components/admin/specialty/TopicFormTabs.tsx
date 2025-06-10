
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
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
        <TabsTrigger 
          value="basic" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          Հիմնական
        </TabsTrigger>
        <TabsTrigger 
          value="content" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          Բովանդակություն
        </TabsTrigger>
        <TabsTrigger 
          value="exercises" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          Վարժություններ
        </TabsTrigger>
        <TabsTrigger 
          value="quiz" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          Վիկտորինա
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <TopicBasicInfoTab
          formData={formData}
          onFormDataChange={onFormDataChange}
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <div className="bg-card rounded-lg border p-6">
          <TopicContentSections
            sections={contentSections}
            onChange={onContentSectionsChange}
          />
        </div>
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
