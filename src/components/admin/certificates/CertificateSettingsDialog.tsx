
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateSettingsDialogProps {
  children: React.ReactNode;
}

const CertificateSettingsDialog = ({ children }: CertificateSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    auto_generate_enabled: true,
    qr_code_enabled: true,
    digital_signature_enabled: false,
    email_notification_enabled: true,
    certificate_prefix: 'CERT',
    diploma_prefix: 'DIP',
    validity_years: 5
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would save the settings to the database
      console.log('Certificate settings:', settings);
      
      toast({
        title: "Հաջողություն",
        description: "Կարգավորումները հաջողությամբ պահպանվել են",
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց պահպանել կարգավորումները",
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
          <DialogTitle className="font-armenian">Վկայականների կարգավորումներ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_generate" className="font-armenian">Ավտոմատ գեներացիա</Label>
              <Switch
                id="auto_generate"
                checked={settings.auto_generate_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_generate_enabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="qr_code" className="font-armenian">QR կոդ</Label>
              <Switch
                id="qr_code"
                checked={settings.qr_code_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, qr_code_enabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="digital_signature" className="font-armenian">Թվային ստորագրություն</Label>
              <Switch
                id="digital_signature"
                checked={settings.digital_signature_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, digital_signature_enabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email_notification" className="font-armenian">Էլ. նամակով ծանուցում</Label>
              <Switch
                id="email_notification"
                checked={settings.email_notification_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notification_enabled: checked }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cert_prefix" className="font-armenian">Վկայականի նախածանց</Label>
              <Input
                id="cert_prefix"
                value={settings.certificate_prefix}
                onChange={(e) => setSettings(prev => ({ ...prev, certificate_prefix: e.target.value }))}
                placeholder="CERT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diploma_prefix" className="font-armenian">Դիպլոմի նախածանց</Label>
              <Input
                id="diploma_prefix"
                value={settings.diploma_prefix}
                onChange={(e) => setSettings(prev => ({ ...prev, diploma_prefix: e.target.value }))}
                placeholder="DIP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validity_years" className="font-armenian">Գործողության ժամկետ (տարի)</Label>
              <Input
                id="validity_years"
                type="number"
                value={settings.validity_years}
                onChange={(e) => setSettings(prev => ({ ...prev, validity_years: parseInt(e.target.value) || 5 }))}
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="font-armenian">
              Չեղարկել
            </Button>
            <Button type="submit" className="font-armenian btn-modern">
              <Settings className="w-4 h-4 mr-2" />
              Պահպանել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateSettingsDialog;
