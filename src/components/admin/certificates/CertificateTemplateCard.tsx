
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Trash2, Eye } from 'lucide-react';
import { useDeleteCertificateTemplate } from '@/hooks/useCertificateTemplates';
import { useToast } from '@/hooks/use-toast';

interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'certificate' | 'diploma' | 'participation';
  design_config: any;
  created_at: string;
}

interface CertificateTemplateCardProps {
  template: CertificateTemplate;
}

const CertificateTemplateCard = ({ template }: CertificateTemplateCardProps) => {
  const deleteTemplate = useDeleteCertificateTemplate();
  const { toast } = useToast();

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

  const handleDelete = async () => {
    if (window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս շաբլոնը:')) {
      try {
        await deleteTemplate.mutateAsync(template.id);
        toast({
          title: "Հաջողություն",
          description: "Շաբլոնը հաջողությամբ ջնջվել է",
        });
      } catch (error) {
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց ջնջել շաբլոնը",
          variant: "destructive",
        });
      }
    }
  };

  return (
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
          <div className="flex gap-1">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              disabled={deleteTemplate.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {template.description && (
          <p className="text-sm text-muted-foreground mb-3 font-armenian">
            {template.description}
          </p>
        )}
        <div className="text-xs text-muted-foreground">
          Ստեղծված՝ {new Date(template.created_at).toLocaleDateString('hy-AM')}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateTemplateCard;
