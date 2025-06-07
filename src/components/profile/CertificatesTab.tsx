
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCertificates } from '@/hooks/useCertificates';
import { Award, Download, QrCode, GraduationCap } from 'lucide-react';

const CertificatesTab = () => {
  const { data: certificates, isLoading } = useCertificates();

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Իմ վկայականները</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates?.map((certificate) => (
              <div key={certificate.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {certificate.is_diploma ? (
                        <GraduationCap className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Award className="w-5 h-5 text-blue-600" />
                      )}
                      <h4 className="font-semibold">
                        {certificate.modules?.title || 'Ընդհանուր վկայական'}
                      </h4>
                      {certificate.is_diploma && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Դիպլոմ
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Տրվել է: {new Date(certificate.issued_at).toLocaleDateString('hy-AM')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {certificate.certificate_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-3 h-3 mr-1" />
                          Ներբեռնել
                        </a>
                      </Button>
                    )}
                    {certificate.qr_code && (
                      <Button variant="outline" size="sm">
                        <QrCode className="w-3 h-3 mr-1" />
                        QR ծածկագիր
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!certificates || certificates.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Վկայականներ չկան</p>
                <p className="text-sm">Ավարտեք դասընթացներ՝ վկայական ստանալու համար</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesTab;
