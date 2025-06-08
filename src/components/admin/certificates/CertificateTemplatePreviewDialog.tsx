
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'certificate' | 'diploma' | 'participation';
  design_config: any;
  created_at: string;
}

interface CertificateTemplatePreviewDialogProps {
  template: CertificateTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CertificateTemplatePreviewDialog = ({ 
  template, 
  open, 
  onOpenChange 
}: CertificateTemplatePreviewDialogProps) => {
  if (!template) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'certificate':
        return 'Ավարտական վկայական';
      case 'diploma':
        return 'Դիպլոմ';
      case 'participation':
        return 'Մասնակցության վկայական';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'certificate':
        return 'bg-edu-blue';
      case 'diploma':
        return 'bg-edu-orange';
      case 'participation':
        return 'bg-success-green';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Շաբլոնի նախադիտում</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Info */}
          <Card className="modern-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-armenian">{template.name}</CardTitle>
                    <Badge className={`${getTypeBadgeColor(template.template_type)} text-white mt-1`}>
                      {getTypeLabel(template.template_type)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {template.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold font-armenian mb-2">Նկարագրություն</h4>
                  <p className="text-sm text-muted-foreground font-armenian">
                    {template.description}
                  </p>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold font-armenian mb-2">Ստեղծման ամսաթիվ</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(template.created_at).toLocaleDateString('hy-AM')}
                </p>
              </div>

              {template.design_config && (
                <div>
                  <h4 className="text-sm font-semibold font-armenian mb-2">Դիզայնի կոնֆիգուրացիա</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(template.design_config, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Preview Area */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Վկայականի նախադիտում</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-armenian text-lg mb-2">Վկայականի նախադիտում</p>
                  <p className="text-sm">
                    Այստեղ կցուցադրվի վկայականի տեսքը՝ հիմնված {template.name} շաբլոնի վրա
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateTemplatePreviewDialog;
