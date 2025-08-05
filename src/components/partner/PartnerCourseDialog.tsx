import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartnerCourse {
  id: string;
  title: string;
  description?: string;
  duration_weeks: number;
  price: number;
  max_students?: number;
  start_date?: string;
  end_date?: string;
  application_deadline?: string;
  requirements?: string;
  status: string;
  image_url?: string;
}

interface PartnerCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course?: PartnerCourse | null;
}

export default function PartnerCourseDialog({ isOpen, onClose, course }: PartnerCourseDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_weeks: 1,
    price: 0,
    max_students: '',
    start_date: '',
    end_date: '',
    application_deadline: '',
    requirements: '',
    status: 'draft'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [courseImage, setCourseImage] = useState<string | null>(null);

  const { data: institution } = useQuery({
    queryKey: ['partner-institution', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_institutions')
        .select('*')
        .eq('partner_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    enabled: !!user?.id && isOpen,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description || '',
        duration_weeks: course.duration_weeks,
        price: course.price,
        max_students: course.max_students?.toString() || '',
        start_date: course.start_date ? course.start_date.split('T')[0] : '',
        end_date: course.end_date ? course.end_date.split('T')[0] : '',
        application_deadline: course.application_deadline ? course.application_deadline.split('T')[0] : '',
        requirements: course.requirements || '',
        status: course.status
      });
      setCourseImage(course.image_url || null);
    } else {
      setFormData({
        title: '',
        description: '',
        duration_weeks: 1,
        price: 0,
        max_students: '',
        start_date: '',
        end_date: '',
        application_deadline: '',
        requirements: '',
        status: 'draft'
      });
      setCourseImage(null);
    }
  }, [course, isOpen]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք ընտրել նկարի ֆայլ",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Սխալ",
        description: "Ֆայլի չափը չպետք է գերազանցի 5 ՄԲ-ը",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}_course.${fileExt}`;

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('course-images')
        .getPublicUrl(fileName);

      setCourseImage(data.publicUrl);
      
      toast({
        title: "Հաջողություն",
        description: "Նկարը բարեհաջող վերբեռնվել է",
      });
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց վերբեռնել նկարը",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setCourseImage(null);
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!institution) {
        throw new Error('Նախ պետք է ստեղծել հաստատությունը');
      }

      const courseData = {
        partner_id: user?.id,
        institution_id: institution.id,
        title: data.title,
        description: data.description || null,
        duration_weeks: data.duration_weeks,
        price: data.price,
        max_students: data.max_students ? parseInt(data.max_students) : null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        application_deadline: data.application_deadline || null,
        requirements: data.requirements || null,
        status: data.status,
        image_url: courseImage
      };

      const { data: result, error } = await supabase
        .from('partner_courses')
        .insert(courseData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Հաջողություն",
        description: "Դասընթացը բարեհաջող ստեղծվել է",
      });
      queryClient.invalidateQueries({ queryKey: ['partner-courses'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Սխալ",
        description: error.message || "Չհաջողվեց ստեղծել դասընթացը",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const courseData = {
        title: data.title,
        description: data.description || null,
        duration_weeks: data.duration_weeks,
        price: data.price,
        max_students: data.max_students ? parseInt(data.max_students) : null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        application_deadline: data.application_deadline || null,
        requirements: data.requirements || null,
        status: data.status,
        image_url: courseImage
      };

      const { data: result, error } = await supabase
        .from('partner_courses')
        .update(courseData)
        .eq('id', course?.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Հաջողություն",
        description: "Դասընթացը բարեհաջող թարմացվել է",
      });
      queryClient.invalidateQueries({ queryKey: ['partner-courses'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել դասընթացը",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (course) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {course ? 'Խմբագրել դասընթացը' : 'Ստեղծել նոր դասընթաց'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Image Section */}
          <div className="space-y-2">
            <Label>Դասընթացի նկարը</Label>
            {courseImage ? (
              <div className="relative">
                <img 
                  src={courseImage} 
                  alt="Դասընթացի նկար"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <input
                  id="course-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('course-image-upload')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Վերբեռնում...' : 'Ընտրել նկար'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG մինչև 5ՄԲ
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">Անվանումը *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_weeks">Տևողությունը (շաբաթ) *</Label>
              <Input
                id="duration_weeks"
                type="number"
                min="1"
                value={formData.duration_weeks}
                onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Գինը (դրամ)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="max_students">Առավելագույն ուսանողների քանակը</Label>
            <Input
              id="max_students"
              type="number"
              min="1"
              value={formData.max_students}
              onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
              placeholder="Անսահմանափակ"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_date">Սկսման ամսաթիվ</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="end_date">Ավարտի ամսաթիվ</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="application_deadline">Դիմումների վերջնաժամկետ</Label>
              <Input
                id="application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requirements">Պահանջներ</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={3}
              placeholder="Դասընթացին մասնակցության համար անհրաժեշտ նախապայմանները"
            />
          </div>

          <div>
            <Label htmlFor="status">Կարգավիճակ</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Նախագիծ</SelectItem>
                <SelectItem value="published">Հրապարակված</SelectItem>
                <SelectItem value="archived">Արխիվացված</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? 'Պահում...' : 'Պահել'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Չեղարկել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}