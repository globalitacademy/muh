
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdatePaymentSettings, PaymentSettings } from '@/hooks/useFinancialData';
import { Settings, Save, TestTube } from 'lucide-react';

interface IdramSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: PaymentSettings;
}

const IdramSettingsDialog: React.FC<IdramSettingsDialogProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [formData, setFormData] = useState({
    is_active: false,
    test_mode: true,
    configuration: {
      merchant_id: '',
      secret_key: '',
      callback_url: '',
      success_url: '',
      fail_url: ''
    }
  });

  const updateSettings = useUpdatePaymentSettings();

  useEffect(() => {
    if (settings) {
      setFormData({
        is_active: settings.is_active,
        test_mode: settings.test_mode,
        configuration: settings.configuration
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(formData);
    onClose();
  };

  const handleConfigChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Idram վճարային կարգավորումներ
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-armenian">Հիմնական կարգավորումներ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-armenian">Ակտիվացնել Idram վճարումները</Label>
                  <p className="text-sm text-muted-foreground">
                    Ակտիվացրեք Idram վճարային համակարգը
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-armenian flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    Թեստային ռեժիմ
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Օգտագործեք թեստային վճարումների համար
                  </p>
                </div>
                <Switch
                  checked={formData.test_mode}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, test_mode: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Idram Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-armenian">Idram կոնֆիգուրացիա</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="merchant_id" className="font-armenian">
                    Մերչանտ ID
                  </Label>
                  <Input
                    id="merchant_id"
                    type="text"
                    value={formData.configuration.merchant_id}
                    onChange={(e) => handleConfigChange('merchant_id', e.target.value)}
                    placeholder="Ձեր Idram մերչանտ ID-ն"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="secret_key" className="font-armenian">
                    Գաղտնի բանալի
                  </Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={formData.configuration.secret_key}
                    onChange={(e) => handleConfigChange('secret_key', e.target.value)}
                    placeholder="Ձեր Idram գաղտնի բանալին"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="callback_url" className="font-armenian">
                  Callback URL
                </Label>
                <Input
                  id="callback_url"
                  type="url"
                  value={formData.configuration.callback_url}
                  onChange={(e) => handleConfigChange('callback_url', e.target.value)}
                  placeholder="https://your-domain.com/api/idram-callback"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL՝ վճարման արդյունքը ստանալու համար
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="success_url" className="font-armenian">
                    Հաջողության URL
                  </Label>
                  <Input
                    id="success_url"
                    type="url"
                    value={formData.configuration.success_url}
                    onChange={(e) => handleConfigChange('success_url', e.target.value)}
                    placeholder="https://your-domain.com/payment-success"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="fail_url" className="font-armenian">
                    Ձախողման URL
                  </Label>
                  <Input
                    id="fail_url"
                    type="url"
                    value={formData.configuration.fail_url}
                    onChange={(e) => handleConfigChange('fail_url', e.target.value)}
                    placeholder="https://your-domain.com/payment-failed"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <h4 className="font-semibold font-armenian text-blue-900">
                  Idram ինտեգրացիայի մասին
                </h4>
                <ul className="space-y-1 text-blue-700 font-armenian">
                  <li>• Idram-ի հետ գործակցելու համար անհրաժեշտ է մերչանտ հաշիվ</li>
                  <li>• Թեստային ռեժիմում վճարումները իրական չեն</li>
                  <li>• Callback URL-ը պետք է հասանելի լինի Idram-ի համար</li>
                  <li>• Անապահովության համար SSL սերտիֆիկատ պարտադիր է</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Չեղարկել
            </Button>
            <Button 
              type="submit" 
              disabled={updateSettings.isPending}
              className="font-armenian btn-modern"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateSettings.isPending ? 'Պահպանվում է...' : 'Պահպանել'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IdramSettingsDialog;
