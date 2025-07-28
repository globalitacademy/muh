
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, User, GraduationCap, Settings } from 'lucide-react';
import { useAdminRole } from '@/hooks/useAdminRole';
import ModuleDetailCurriculum from './ModuleDetailCurriculum';
import ModuleDetailOverview from './ModuleDetailOverview';
import ModuleDetailInstructors from './ModuleDetailInstructors';
import ModuleInstructorsManagement from '../admin/modules/ModuleInstructorsManagement';
import { Module } from '@/types/database';
import { Topic } from '@/types/database';

interface ModuleDetailTabsProps {
  module: Module;
  topics?: Topic[];
  hasFullAccess: boolean;
  onTopicClick: (topicId: string) => void;
}

const ModuleDetailTabs = ({ module, topics, hasFullAccess, onTopicClick }: ModuleDetailTabsProps) => {
  const { data: isAdmin } = useAdminRole();

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'} bg-muted/50 p-1 rounded-xl`}>
        <TabsTrigger value="overview" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
          <BookOpen className="w-4 h-4 mr-2" />
          Նկարագիր
        </TabsTrigger>
        <TabsTrigger value="curriculum" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
          <GraduationCap className="w-4 h-4 mr-2" />
          Դասընթացի ծրագիր
        </TabsTrigger>
        <TabsTrigger value="instructors" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
          <User className="w-4 h-4 mr-2" />
          Մասնագետներ
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="manage-instructors" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <Settings className="w-4 h-4 mr-2" />
            Կառավարում
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <ModuleDetailOverview module={module} topicsCount={topics?.length || 0} />
      </TabsContent>

      <TabsContent value="curriculum" className="mt-6">
        <ModuleDetailCurriculum
          topics={topics}
          hasFullAccess={hasFullAccess}
          onTopicClick={onTopicClick}
        />
      </TabsContent>

      <TabsContent value="instructors" className="mt-6">
        <ModuleDetailInstructors moduleId={module.id} />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="manage-instructors" className="mt-6">
          <ModuleInstructorsManagement moduleId={module.id} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ModuleDetailTabs;
