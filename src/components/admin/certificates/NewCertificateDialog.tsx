
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useModules } from '@/hooks/useModules';

interface NewCertificateDialogProps {
  children: React.ReactNode;
}

const NewCertificateDialog = ({ children }: NewCertificateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [certificateData, setCertificateData] = useState({
    user_id: '',
    module_id: '',
    is_diploma: false,
    custom_recipient_name: '',
    notes: ''
  });
  const { toast } = useToast();
  const { data: modules } = useModules();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateData.user_id) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք մուտքագրել ստացողի ID-ն",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Here you would create the certificate in the database
      console.log('Certificate data:', certificateData);
      
      toast({
        title: "Հաջողություն",
        description: "Վկայականը հաջողությամբ ստեղծվել է",
      });
      
      setOpen(false);
      setCertificateData({
        user_id: '',
        module_id: '',
        is_diploma: false,
        custom_recipient_name: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ստեղծել վկայականը",
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
          <DialogTitle className="font-armenian">Նոր վկայական</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_id" className="font-armenian">Ստացողի ID</Label>
            <Input
              id="user_id"
              value={certificateData.user_id}
              onChange={(e) => setCertificateData(prev => ({ ...prev, user_id: e.target.value }))}
              placeholder="Մուտքագրեք օգտատիրոջ ID-ն"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_name" className="font-armenian">Ստացողի անունը (ըստ ցանկության)</Label>
            <Input
              id="custom_name"
              value={certificateData.custom_recipient_name}
              onChange={(e) => setCertificateData(prev => ({ ...prev, custom_recipient_name: e.target.value }))}
              placeholder="Եթե տարբերվում է պրոֆիլի անունից"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="module_id" className="font-armenian">Դասընթաց</Label>
            <Select value={certificateData.module_id} onValueChange={(value) => setCertificateData(prev => ({ ...prev, module_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Ընտրեք դասընթացը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Ընդհանուր վկայական</SelectItem>
                {modules?.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_diploma" className="font-armenian">Դիպլոմ է</Label>
            <Switch
              id="is_diploma"
              checked={certificateData.is_diploma}
              onCheckedChange={(checked) => setCertificateData(prev => ({ ...prev, is_diploma: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-armenian">Լրացուցիչ գրառումներ</Label>
            <Input
              id="notes"
              value={certificateData.notes}
              onChange={(e) => setCertificateData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Լրացուցիչ տեղեկություններ"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="font-armenian">
              Չեղարկել
            </Button>
            <Button type="submit" className="font-armenian btn-modern">
              <Award className="w-4 h-4 mr-2" />
              Ստեղծել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCertificateDialog;
