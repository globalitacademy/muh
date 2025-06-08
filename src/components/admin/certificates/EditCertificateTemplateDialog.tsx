
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateCertificateTemplate } from '@/hooks/useCertificateTemplates';

interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'certificate' | 'diploma' | 'participation';
  design_config: any;
  created_at: string;
}

interface EditCertificateTemplateDialogProps {
  template: CertificateTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCertificateTemplateDialog = ({ 
  template, 
  open, 
  onOpenChange 
}: EditCertificateTemplateDialogProps) => {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    template_type: 'certificate' as 'certificate' | 'diploma' | 'participation',
    design_config: ''
  });
  const { toast } = useToast();
  const updateTemplate = useUpdateCertificateTemplate();

  useEffect(() => {
    if (template) {
      setTemplateData({
        name: template.name,
        description: template.description || '',
        template_type: template.template_type,
        design_config: typeof template.design_config === 'string' 
          ? template.design_config 
          : JSON.stringify(template.design_config, null, 2)
      });
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template || !templateData.name.trim()) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք մուտքագրել շաբլոնի անվանումը",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateTemplate.mutateAsync({
        id: template.id,
        ...templateData
      });
      
      toast({
        title: "Հաջողություն",
        description: "Շաբլոնը հաջողությամբ թարմացվել է",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել շաբլոնը",
        variant: "destructive",
      });
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-armenian">Խմբագրել շաբլոնը</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="font-armenian">Անվանում</Label>
            <Input
              id="edit-name"
              value={templateData.name}
              onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Շաբլոնի անվանումը"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-template_type" className="font-armenian">Տեսակ</Label>
            <Select 
              value={templateData.template_type} 
              onValueChange={(value: 'certificate' | 'diploma' | 'participation') => 
                setTemplateData(prev => ({ ...prev, template_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Ընտրեք տեսակը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certificate">Ավարտական վկայական</SelectItem>
                <SelectItem value="diploma">Դիպլոմ</SelectItem>
                <SelectItem value="participation">Մասնակցության վկայական</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="font-armenian">Նկարագրություն</Label>
            <Textarea
              id="edit-description"
              value={templateData.description}
              onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Շաբլոնի նկարագրությունը"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-design_config" className="font-armenian">Դիզայնի կոնֆիգուրացիա</Label>
            <Textarea
              id="edit-design_config"
              value={templateData.design_config}
              onChange={(e) => setTemplateData(prev => ({ ...prev, design_config: e.target.value }))}
              placeholder="JSON կոնֆիգուրացիա կամ CSS ստիլներ"
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="font-armenian"
              disabled={updateTemplate.isPending}
            >
              Չեղարկել
            </Button>
            <Button 
              type="submit" 
              className="font-armenian btn-modern"
              disabled={updateTemplate.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateTemplate.isPending ? 'Պահվում է...' : 'Պահել'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCertificateTemplateDialog;
