
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, MessageSquare, BarChart3, Settings, FileText } from 'lucide-react';
import { useCreateCourseAction } from '@/hooks/useInstructorDashboard';

const QuickActions = () => {
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty_level: '',
    price: 0,
    duration_weeks: 1
  });

  const createCourse = useCreateCourseAction();

  const handleCreateCourse = async () => {
    if (!courseData.title || !courseData.category || !courseData.difficulty_level) {
      return;
    }

    try {
      await createCourse.mutateAsync(courseData);
      setIsCreateCourseOpen(false);
      setCourseData({
        title: '',
        description: '',
        category: '',
        difficulty_level: '',
        price: 0,
        duration_weeks: 1
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const quickActionButtons = [
    {
      icon: Plus,
      label: 'Նոր դասընթաց',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setIsCreateCourseOpen(true)
    },
    {
      icon: Users,
      label: 'Ուսանողների կառավարում',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Manage students')
    },
    {
      icon: MessageSquare,
      label: 'Հաղորդագրություններ',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Messages')
    },
    {
      icon: BarChart3,
      label: 'Վերլուծություն',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => console.log('Analytics')
    },
    {
      icon: FileText,
      label: 'Հաշվետվություններ',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Reports')
    },
    {
      icon: Settings,
      label: 'Կարգավորումներ',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => console.log('Settings')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">Արագ գործողություններ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActionButtons.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col gap-2 ${action.color} text-white border-none font-armenian`}
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Create Course Dialog */}
        <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-armenian">Նոր դասընթաց ստեղծել</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-armenian">Վերնագիր</Label>
                <Input
                  id="title"
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  placeholder="Մուտքագրեք դասընթացի վերնագիրը"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
                <Textarea
                  id="description"
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  placeholder="Մուտքագրեք դասընթացի նկարագրությունը"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category" className="font-armenian">Կատեգորիա</Label>
                  <Select value={courseData.category} onValueChange={(value) => setCourseData({ ...courseData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք կատեգորիան" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Ծրագրավորում</SelectItem>
                      <SelectItem value="design">Դիզայն</SelectItem>
                      <SelectItem value="business">Բիզնես</SelectItem>
                      <SelectItem value="marketing">Մարքեթինգ</SelectItem>
                      <SelectItem value="languages">Լեզուներ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="difficulty" className="font-armenian">Բարդության մակարդակ</Label>
                  <Select value={courseData.difficulty_level} onValueChange={(value) => setCourseData({ ...courseData, difficulty_level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք մակարդակը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Սկսնակ</SelectItem>
                      <SelectItem value="intermediate">Միջին</SelectItem>
                      <SelectItem value="advanced">Բարձր</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="font-armenian">Գին (֏)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration" className="font-armenian">Տևողություն (շաբաթներ)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={courseData.duration_weeks}
                    onChange={(e) => setCourseData({ ...courseData, duration_weeks: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)} className="font-armenian">
                Չեղարկել
              </Button>
              <Button 
                onClick={handleCreateCourse} 
                disabled={createCourse.isPending}
                className="font-armenian"
              >
                {createCourse.isPending ? 'Ստեղծվում է...' : 'Ստեղծել'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
