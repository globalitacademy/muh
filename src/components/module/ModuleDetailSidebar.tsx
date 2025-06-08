
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/types/database';
import { User } from '@supabase/supabase-js';
import CompanyCodeInput from '@/components/CompanyCodeInput';

interface ModuleDetailSidebarProps {
  module: Module;
  user: User | null;
  hasFullAccess: boolean;
  enrollModule: {
    mutateAsync: (moduleId: string) => Promise<any>;
    isPending: boolean;
  };
  onEnroll: () => void;
  onStartLearning: () => void;
  onNavigateToAuth: () => void;
  onCompanyCodeVerified: (isValid: boolean) => void;
}

const ModuleDetailSidebar = ({
  module,
  user,
  hasFullAccess,
  enrollModule,
  onEnroll,
  onStartLearning,
  onNavigateToAuth,
  onCompanyCodeVerified
}: ModuleDetailSidebarProps) => {
  const [tempAccess, setTempAccess] = useState(false);
  const [accessTimer, setAccessTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTempCodeVerified = (isValid: boolean) => {
    if (isValid) {
      setTempAccess(true);
      onCompanyCodeVerified(true);
      
      // Set timer for 60 minutes (3600000 ms)
      const timer = setTimeout(() => {
        setTempAccess(false);
        onCompanyCodeVerified(false);
      }, 3600000);
      
      setAccessTimer(timer);
    }
  };

  const effectiveAccess = hasFullAccess || tempAccess;

  return (
    <div className="space-y-6">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle className="text-center font-armenian">
            Ծրագրային մանրամասներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-edu-blue">
              {module.price.toLocaleString()} ֏
            </div>
            <div className="text-sm text-muted-foreground font-armenian">
              Ամբողջ դասընթացի համար
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              {effectiveAccess ? (
                <>
                  <div className="text-center">
                    <div className="text-sm font-armenian mb-2">Ձեր առաջընթացը</div>
                    <Progress value={0} className="mb-2" />
                    <div className="text-xs text-muted-foreground">0% ավարտված</div>
                  </div>
                  <Button className="w-full btn-modern font-armenian" onClick={onStartLearning}>
                    Սկսել ուսուցումը
                  </Button>
                  {tempAccess && (
                    <div className="text-xs text-center text-warning-yellow font-armenian">
                      Ժամանակավոր մուտք՝ 60 րոպե
                    </div>
                  )}
                </>
              ) : (
                <Button 
                  onClick={onEnroll}
                  disabled={enrollModule.isPending}
                  className="w-full btn-modern font-armenian"
                >
                  {enrollModule.isPending ? 'Գրանցվում է...' : 'Գրանցվել հիմա'}
                </Button>
              )}
            </div>
          ) : (
            <Button 
              onClick={onNavigateToAuth}
              className="w-full btn-modern font-armenian"
            >
              Գրանցվել դասընթացի համար
            </Button>
          )}

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between font-armenian">
              <span>Վկայագիր:</span>
              <span>Այո</span>
            </div>
            <div className="flex justify-between font-armenian">
              <span>Մուտք:</span>
              <span>Մշտապես</span>
            </div>
            <div className="flex justify-between font-armenian">
              <span>Լեզու:</span>
              <span>Հայերեն</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Code Section */}
      <Card className="border-dashed border-2 border-edu-blue/30 bg-gradient-to-br from-edu-blue/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-center font-armenian text-lg flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-edu-blue/10 text-edu-blue flex items-center justify-center text-sm">
              🎁
            </div>
            Ժամանակավոր մուտք
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-armenian mb-4">
              Օգտագործեք գործընկերոջ կոդը՝ բոլոր դասերը 60 րոպեով անվճար դիտելու համար
            </p>
          </div>
          
          <CompanyCodeInput onCodeVerified={handleTempCodeVerified} />
          
          <div className="text-xs text-center text-muted-foreground font-armenian border-t pt-3">
            Կոդը վավեր է միայն 60 րոպե
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleDetailSidebar;
