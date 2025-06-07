
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { BookOpen, Users, BarChart3, Plus, Settings, MessageSquare } from 'lucide-react';

const InstructorProfile = () => {
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
            <BookOpen className="w-5 h-5" />
            Դասախոսի պրոֆիլ
          </CardTitle>
          <CardDescription className="font-armenian">
            Բարի գալուստ, {profile?.name || 'Դասախոս'}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Բաժին</p>
              <p className="font-semibold">{profile?.department || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Կազմակերպություն</p>
              <p className="font-semibold">{profile?.organization || 'Նշված չէ'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Դասախոսի գործողություններ</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="default">
            <Plus className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Նոր դասընթաց</p>
              <p className="text-xs opacity-90">Ստեղծել դասընթաց</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Users className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Ուսանողներ</p>
              <p className="text-xs text-muted-foreground">Կառավարել ուսանողներին</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <BarChart3 className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Վիճակագրություն</p>
              <p className="text-xs text-muted-foreground">Տեսնել վիճակագրությունը</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <MessageSquare className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Հաղորդագրություններ</p>
              <p className="text-xs text-muted-foreground">Ուսանողների հետ կապ</p>
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

      {/* My Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Իմ դասընթացները</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">JavaScript հիմունքներ</h4>
                <p className="text-sm text-muted-foreground">24 ուսանող • 8 դաս</p>
              </div>
              <Badge variant="secondary">Ակտիվ</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">React զարգացում</h4>
                <p className="text-sm text-muted-foreground">18 ուսանող • 12 դաս</p>
              </div>
              <Badge variant="secondary">Ակտիվ</Badge>
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
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground font-armenian">Դասընթացներ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">142</p>
              <p className="text-sm text-muted-foreground font-armenian">Ուսանողներ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground font-armenian">Գնահատական</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-muted-foreground font-armenian">Ավարտելիություն</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfile;
