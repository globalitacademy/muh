
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { BookOpen, Award, Clock, Users, Target } from 'lucide-react';

const StudentProfile = () => {
  const { data: profile, isLoading, error } = useUserProfile();

  console.log('StudentProfile - Loading:', isLoading);
  console.log('StudentProfile - Profile data:', profile);
  console.log('StudentProfile - Error:', error);

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  if (error) {
    console.error('StudentProfile - Error loading profile:', error);
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Սխալ է տեղի ունեցել</h2>
        <p className="text-muted-foreground">Չհաջողվեց բեռնել պրոֆիլի տվյալները:</p>
        <p className="text-sm text-red-500 mt-2">{error?.message}</p>
      </div>
    );
  }

  if (!profile) {
    console.log('StudentProfile - No profile data available');
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Պրոֆիլ չի գտնվել</h2>
        <p className="text-muted-foreground">Ձեր պրոֆիլի տվյալները հասանելի չեն:</p>
      </div>
    );
  }

  console.log('StudentProfile - Rendering with profile:', {
    name: profile.name,
    role: profile.role,
    group_number: profile.group_number,
    department: profile.department
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <Users className="w-5 h-5" />
            Ուսանողի պրոֆիլ
          </CardTitle>
          <CardDescription className="font-armenian">
            Բարի գալուստ, {profile?.name || 'Ուսանող'}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Խմբի համար</p>
              <p className="font-semibold">{profile?.group_number || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Բաժին</p>
              <p className="font-semibold">{profile?.department || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Դեր</p>
              <p className="font-semibold">{profile?.role || 'Նշված չէ'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Արագ գործողություններ</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <BookOpen className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Դասընթացներ</p>
              <p className="text-xs text-muted-foreground">Բոլոր դասընթացները</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Target className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Առաջընթաց</p>
              <p className="text-xs text-muted-foreground">Տեսնել առաջընթացը</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Award className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Սերտիֆիկատներ</p>
              <p className="text-xs text-muted-foreground">Իմ սերտիֆիկատները</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ընթացիկ դասընթացներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">JavaScript հիմունքներ</h4>
                <p className="text-sm text-muted-foreground">75% ավարտված</p>
              </div>
              <Badge variant="secondary">Ընթացիկ</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">React զարգացում</h4>
                <p className="text-sm text-muted-foreground">45% ավարտված</p>
              </div>
              <Badge variant="secondary">Ընթացիկ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
