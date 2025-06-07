
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Briefcase, Users, Search, FileText, Star, TrendingUp } from 'lucide-react';

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
            <Briefcase className="w-5 h-5" />
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
            <Search className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Փնտրել ուսանողներ</p>
              <p className="text-xs opacity-90">Գտնել ճիշտ թեկնածուին</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Աշխատանքի հայտարարություն</p>
              <p className="text-xs text-muted-foreground">Հրապարակել հայտարարություն</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Users className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Թեկնածուներ</p>
              <p className="text-xs text-muted-foreground">Կառավարել թեկնածուներին</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <Star className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Գնահատականներ</p>
              <p className="text-xs text-muted-foreground">Գնահատել ուսանողներին</p>
            </div>
          </Button>
          <Button className="flex items-center gap-2 h-auto p-4 font-armenian" variant="outline">
            <TrendingUp className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Վիճակագրություն</p>
              <p className="text-xs text-muted-foreground">Տեսնել հանրագումարը</p>
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
                <h4 className="font-semibold font-armenian">Frontend ծրագրավորող</h4>
                <p className="text-sm text-muted-foreground">12 դիմորդ • React, JavaScript</p>
              </div>
              <Badge variant="secondary">Ակտիվ</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold font-armenian">UI/UX դիզայներ</h4>
                <p className="text-sm text-muted-foreground">8 դիմորդ • Figma, Adobe</p>
              </div>
              <Badge variant="secondary">Ակտիվ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Candidates */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Լավագույն թեկնածուներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">ԱՀ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Անի Հակոբյան</h4>
                  <p className="text-sm text-muted-foreground">JavaScript, React • 4.9/5</p>
                </div>
              </div>
              <Badge variant="outline">Նոր</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">ԴՄ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Դավիթ Մուրադյան</h4>
                  <p className="text-sm text-muted-foreground">Node.js, Python • 4.8/5</p>
                </div>
              </div>
              <Badge variant="outline">Առաջարկված</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ընկերության վիճակագրություն</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground font-armenian">Ակտիվ հայտարարություններ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground font-armenian">Դիմորդներ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground font-armenian">Վարձված</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">4.7</p>
              <p className="text-sm text-muted-foreground font-armenian">Գնահատական</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerProfile;
