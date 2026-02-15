
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TopicContentProps {
  topicId: string;
  onComplete: () => void;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

const TopicContent = ({ topicId, onComplete }: TopicContentProps) => {
  const { t } = useLanguage();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Fetch topic content from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-content', topicId],
    queryFn: async () => {
      console.log('Fetching topic content for:', topicId);
      const { data, error } = await supabase.
      from('topics').
      select('title, content, resources').
      eq('id', topicId).
      maybeSingle();

      if (error) {
        console.error('Error fetching topic content:', error);
        throw error;
      }

      console.log('Topic content fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  // Parse content sections
  const parseContentSections = (content: string | null): ContentSection[] => {
    if (!content) return [];

    try {
      const parsed = JSON.parse(content);
      if (parsed.sections && Array.isArray(parsed.sections)) {
        return parsed.sections.sort((a: ContentSection, b: ContentSection) => a.order - b.order);
      }
    } catch (e) {
      // If parsing fails, treat as old format (plain text)
      if (typeof content === 'string' && content.trim()) {
        return [{
          id: 'section-1',
          title: t('topic.theoretical-material'),
          content: content,
          order: 0
        }];
      }
    }
    return [];
  };

  // Helper function to recursively parse JSON strings
  const recursiveJSONParse = (data: any): any => {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return recursiveJSONParse(parsed); // Recursively parse in case of double encoding
      } catch {
        return data; // Return as is if parsing fails
      }
    }
    return data;
  };

  // Parse resources
  const parseResources = (resources: any) => {
    if (!resources) return [];

    try {
      // Use recursive parsing to handle double-encoded JSON
      let parsed = recursiveJSONParse(resources);

      console.log('Parsed resources:', parsed);

      // Handle wrapped format {resources: [...]}
      if (parsed && typeof parsed === 'object' && 'resources' in parsed) {
        parsed = parsed.resources;
      }

      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing resources:', e);
      return [];
    }
  };

  const contentSections = parseContentSections(topic?.content);
  const resources = parseResources(topic?.resources);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);

      // Check if all sections are completed
      if (newCompleted.length === contentSections.length) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  const allSectionsCompleted = contentSections.length > 0 && completedSections.length === contentSections.length;
  const progressPercentage = contentSections.length > 0 ? completedSections.length / contentSections.length * 100 : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse font-armenian">{t('topic.loading-content')}</div>
          </CardContent>
        </Card>
      </div>);

  }

  if (error || !topic) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground font-armenian">
              {t('topic.error-loading')}
            </p>
          </CardContent>
        </Card>
      </div>);

  }

  if (contentSections.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground font-armenian">
              {t('topic.content-coming-soon')}
            </p>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-armenian">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-edu-blue" />
              {t('topic.progress')}
            </span>
            <span className="text-sm text-muted-foreground">
              {completedSections.length}/{contentSections.length} {t('topic.sections-completed')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }} />

          </div>
          <p className="text-sm text-muted-foreground font-armenian">
            {Math.round(progressPercentage)}% {t('topic.completed')}
          </p>
        </CardContent>
      </Card>

      {/* Content Sections */}
      {contentSections.map((section, index) => {
        const isCompleted = completedSections.includes(section.id);
        const isExpanded = expandedSections.has(section.id);

        return (
          <Card key={section.id} className={`border-l-4 ${isCompleted ? 'border-l-green-500' : 'border-l-edu-blue'}`}>
            <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between font-armenian">
                    <span className="flex items-center gap-3">
                      <span className="text-sm font-medium text-edu-blue min-w-[2rem]">
                        {index + 1}.
                      </span>
                      {isCompleted ?
                      <CheckCircle className="w-5 h-5 text-green-600" /> :

                      <FileText className="w-5 h-5 text-edu-blue" />
                      }
                      {section.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCompleted &&
                      <span className="text-xs bg-success/20 text-success-foreground px-2 py-1 rounded-full font-armenian">
                          {t('topic.completed')}
                        </span>
                      }
                      {isExpanded ?
                      <ChevronDown className="w-4 h-4" /> :

                      <ChevronRight className="w-4 h-4" />
                      }
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {section.content ?
                  <div
                    className="prose prose-sm max-w-none font-armenian mb-4 ql-editor"
                    dangerouslySetInnerHTML={{ __html: section.content }} /> :


                  <p className="text-muted-foreground font-armenian mb-4">
                      {t('topic.section-coming-soon')}
                    </p>
                  }
                  
                  <Button
                    onClick={() => markSectionComplete(section.id)}
                    disabled={isCompleted}
                    className="font-armenian"
                    variant={isCompleted ? "default" : "outline"}>

                    {isCompleted ?
                    <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('topic.completed')}
                      </> :

                    t('topic.mark-completed')
                    }
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>);

      })}

      {/* Complete All Button */}
      {allSectionsCompleted &&
      <Card className="border-success/30 bg-success/10">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-success-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-success-foreground font-armenian mb-2">
              {t('topic.congratulations')}
            </h3>
            <p className="text-success-foreground/90 font-armenian mb-4">
              {t('topic.all-sections-done')}
            </p>
            <Button onClick={onComplete} className="font-armenian">
              {t('topic.next-step')}
            </Button>
          </CardContent>
        </Card>
      }

      {/* Resources Section (if available) */}
      {resources.length > 0 &&
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-armenian">
              <FileText className="w-5 h-5 text-edu-blue" />
              Լրացուցիչ ռեսուրսներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources.map((resource: any, index: number) =>
            <div key={resource.id || index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground font-armenian mb-1 text-left">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-armenian mb-2 text-left">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {resource.type &&
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-armenian">
                            {resource.type}
                          </span>
                    }
                        {resource.difficulty &&
                    <span className={`text-xs px-2 py-1 rounded font-armenian ${
                    resource.difficulty === 'beginner' ? 'bg-success/20 text-success-foreground' :
                    resource.difficulty === 'intermediate' ? 'bg-warning/20 text-warning-foreground' :
                    'bg-destructive/20 text-destructive-foreground'}`
                    }>
                            {resource.difficulty === 'beginner' ? 'Սկսնակ' :
                      resource.difficulty === 'intermediate' ? 'Միջին' : 'Առաջադեմ'}
                          </span>
                    }
                      </div>
                    </div>
                    {resource.url &&
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium font-armenian whitespace-nowrap">

                        Բացել →
                      </a>
                }
                  </div>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default TopicContent;