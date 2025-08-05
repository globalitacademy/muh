import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Bell, Users } from 'lucide-react';

export default function PartnerSettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Կարգավորումներ</h2>
        <p className="text-muted-foreground">
          Կառավարեք ձեր գործընկերային հաշվի կարգավորումները
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Անվտանգություն
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Կառավարեք ձեր հաշվի անվտանգության կարգավորումները
            </p>
            <Button variant="outline" className="w-full">
              Փոխել գաղտնաբառը
            </Button>
            <Button variant="outline" className="w-full">
              Երկգործոն վավերացում
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Ծանուցումներ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Կարգավորեք ծանուցումների կարգավորումները
            </p>
            <Button variant="outline" className="w-full">
              Ծանուցումների կարգավորումներ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Գործընկեր իրավունքներ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Տեսակետը ձեր գործընկերային իրավունքների մասին
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Դասընթացների ստեղծում</span>
                <span className="text-sm text-green-600">Թույլատրված</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ուսանողների կառավարում</span>
                <span className="text-sm text-green-600">Թույլատրված</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Վճարումների կառավարում</span>
                <span className="text-sm text-yellow-600">Սպասում է վավերացմանը</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ընդհանուր
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ընդհանուր կարգավորումներ
            </p>
            <Button variant="outline" className="w-full">
              Լեզվի կարգավորումներ
            </Button>
            <Button variant="outline" className="w-full">
              Ֆայլերի կարգավորումներ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}