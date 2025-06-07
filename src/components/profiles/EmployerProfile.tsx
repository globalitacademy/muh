
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Building2, UserPlus, Search, FileText, MessageSquare, Settings, Users } from 'lucide-react';

const EmployerProfile = () => {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <Building2 className="w-5 h-5" />
            Գործատուի պրոֆիլ
          </CardTitle>
          <CardDescription className="font-armenian">
            Բարի գալուստ, {profile?.name || 'Գործատու'}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Կազմակերպություն</p>
              <p className="font-semibold">{profile?.organization || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Բաժին</p>
              <p className="font-semibold">{profile?.department || 'Նշված չէ'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Գործատուի գործողություններ</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="default">
            <UserPlus className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Աշխատանք հայտարարել</p>
              <p className="text-xs opacity-90">Նոր հայտարարություն</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Search className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Թեկնածուներ</p>
              <p className="text-xs text-muted-foreground">Գտնել թեկնածուներ</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">CV-ներ</p>
              <p className="text-xs text-muted-foreground">Դիտել կենսագրությունները</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <MessageSquare className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Հաղորդագրություններ</p>
              <p className="text-xs text-muted-foreground">Թեկնածուների հետ կապ</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Users className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Թիմ</p>
              <p className="text-xs text-muted-foreground">Թիմի անդամներ</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Settings className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Կարգավորումներ</p>
              <p className="text-xs text-muted-foreground">Պրոֆիլի կարգավորում</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Active Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ակտիվ հայտարարություններ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">React զարգացուցիչ</h4>
                <p className="text-sm text-muted-foreground">12 դիմում • 5 օր առաջ</p>
              </div>
              <Badge variant="secondary">Ակտիվ</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">UI/UX դիզայներ</h4>
                <p className="text-sm text-muted-foreground">8 դիմում • 3 օր առաջ</p>
              </div>
              <Badge variant="secondary">Ակտիվ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Վերջին դիմումները</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">Արմեն Ավետիսյան</h4>
                <p className="text-sm text-muted-foreground font-armenian">React զարգացուցիչ • 2 ժամ առաջ</p>
              </div>
              <Badge variant="outline">Նոր</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">Մարի Հակոբյան</h4>
                <p className="text-sm text-muted-foreground font-armenian">UI/UX դիզայներ • 4 ժամ առաջ</p>
              </div>
              <Badge variant="outline">Նոր</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Վիճակագրություն</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-muted-foreground font-armenian">Ակտիվ հայտարարություններ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">248</p>
              <p className="text-sm text-muted-foreground font-armenian">Ընդհանուր դիմումներ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">32</p>
              <p className="text-sm text-muted-foreground font-armenian">Հարցազրույցներ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground font-armenian">Վարձակալված</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerProfile;
