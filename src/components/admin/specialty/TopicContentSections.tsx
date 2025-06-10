
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, GripVertical, Edit3 } from 'lucide-react';
import EnhancedRichTextEditor from '@/components/ui/enhanced-rich-text-editor';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface TopicContentSectionsProps {
  sections: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
}

const TopicContentSections = ({ sections, onChange }: TopicContentSectionsProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    sections.length > 0 ? sections[0].id : null
  );

  const addSection = () => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      title: `Տեսական նյութ ${sections.length + 1}`,
      content: '',
      order: sections.length,
    };
    onChange([...sections, newSection]);
    setExpandedSection(newSection.id);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections
      .filter(s => s.id !== sectionId)
      .map((s, index) => ({ ...s, order: index }));
    onChange(updatedSections);
    if (expandedSection === sectionId) {
      setExpandedSection(updatedSections.length > 0 ? updatedSections[0].id : null);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<ContentSection>) => {
    const updatedSections = sections.map(s =>
      s.id === sectionId ? { ...s, ...updates } : s
    );
    onChange(updatedSections);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedSections = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onChange(reorderedSections);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium font-armenian">Տեսական նյութի բաժիններ</h3>
        <Button onClick={addSection} size="sm" className="font-armenian">
          <Plus className="w-4 h-4 mr-2" />
          Ավելացնել բաժին
        </Button>
      </div>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground font-armenian mb-4">
              Դեռ բաժիններ չկան: Ավելացրեք առաջին բաժինը:
            </p>
            <Button onClick={addSection} className="font-armenian">
              <Plus className="w-4 h-4 mr-2" />
              Ավելացնել բաժին
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:text-primary"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`section-title-${section.id}`} className="font-armenian">
                                Բաժնի վերնագիր
                              </Label>
                              <Input
                                id={`section-title-${section.id}`}
                                value={section.title}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                placeholder="Մուտքագրեք բաժնի վերնագիրը"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setExpandedSection(
                                  expandedSection === section.id ? null : section.id
                                )}
                                className="font-armenian"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                {expandedSection === section.id ? 'Փակել' : 'Խմբագրել'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSection(section.id)}
                                className="font-armenian"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Ջնջել
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {expandedSection === section.id && (
                          <CardContent>
                            <Label className="font-armenian mb-2 block">Բովանդակություն</Label>
                            <EnhancedRichTextEditor
                              value={section.content}
                              onChange={(content) => updateSection(section.id, { content })}
                              placeholder="Մուտքագրեք բաժնի բովանդակությունը..."
                              height={450}
                            />
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default TopicContentSections;
