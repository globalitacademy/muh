
import React from 'react';
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
  return (
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
            {hasFullAccess ? (
              <>
                <div className="text-center">
                  <div className="text-sm font-armenian mb-2">Ձեր առաջընթացը</div>
                  <Progress value={0} className="mb-2" />
                  <div className="text-xs text-muted-foreground">0% ավարտված</div>
                </div>
                <Button className="w-full btn-modern font-armenian" onClick={onStartLearning}>
                  Սկսել ուսուցումը
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={onEnroll}
                  disabled={enrollModule.isPending}
                  className="w-full btn-modern font-armenian"
                >
                  {enrollModule.isPending ? 'Գրանցվում է...' : 'Գրանցվել հիմա'}
                </Button>
                
                {/* Company Code Input for authenticated users without access */}
                <div className="border-t pt-4">
                  <div className="text-sm font-armenian text-center mb-3 text-muted-foreground">
                    Կամ օգտագործեք գործընկերոջ կոդ
                  </div>
                  <CompanyCodeInput onCodeVerified={onCompanyCodeVerified} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              onClick={onNavigateToAuth}
              className="w-full btn-modern font-armenian"
            >
              Գրանցվել դասընթացի համար
            </Button>
            
            {/* Company Code Input for non-authenticated users */}
            <div className="border-t pt-4">
              <div className="text-sm font-armenian text-center mb-3 text-muted-foreground">
                Կամ օգտագործեք գործընկերոջ կոդ
              </div>
              <CompanyCodeInput onCodeVerified={onCompanyCodeVerified} />
            </div>
          </div>
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
  );
};

export default ModuleDetailSidebar;
