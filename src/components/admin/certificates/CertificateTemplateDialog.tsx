
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateTemplateDialogProps {
  children: React.ReactNode;
}

const CertificateTemplateDialog = ({ children }: CertificateTemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    template_type: 'certificate',
    design_config: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would save the template to the database
      console.log('Template data:', templateData);
      
      toast({
        title: "Հաջողություն",
        description: "Շաբլոնը հաջողությամբ ստեղծվել է",
      });
      
      setOpen(false);
      setTemplateData({
        name: '',
        description: '',
        template_type: 'certificate',
        design_config: ''
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ստեղծել շաբլոնը",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-armenian">Նոր վկայականի շաբլոն</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-armenian">Անվանում</Label>
            <Input
              id="name"
              value={templateData.name}
              onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Շաբլոնի անվանումը"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template_type" className="font-armenian">Տեսակ</Label>
            <Select value={templateData.template_type} onValueChange={(value) => setTemplateData(prev => ({ ...prev, template_type: value }))}>
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
            <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={templateData.description}
              onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Շաբլոնի նկարագրությունը"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="design_config" className="font-armenian">Դիզայնի կոնֆիգուրացիա</Label>
            <Textarea
              id="design_config"
              value={templateData.design_config}
              onChange={(e) => setTemplateData(prev => ({ ...prev, design_config: e.target.value }))}
              placeholder="JSON կոնֆիգուրացիա կամ CSS ստիլներ"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="font-armenian">
              Չեղարկել
            </Button>
            <Button type="submit" className="font-armenian btn-modern">
              <Plus className="w-4 h-4 mr-2" />
              Ստեղծել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateTemplateDialog;
