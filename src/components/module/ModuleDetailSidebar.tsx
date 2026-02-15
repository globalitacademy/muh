import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/types/database';
import { User } from '@supabase/supabase-js';
import CompanyCodeInput from '@/components/CompanyCodeInput';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccessSession } from '@/hooks/useAccessSession';

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
  const { t } = useLanguage();
  const { isActive, hasModuleAccess, formatTimeRemaining, timeRemaining } = useAccessSession();

  const hasTempAccess = isActive && hasModuleAccess(module.id);
  const effectiveAccess = hasFullAccess || hasTempAccess;

  const handleTempCodeVerified = (isValid: boolean) => {
    onCompanyCodeVerified(isValid);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-armenian">{t('module.price')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-edu-blue">
              {module.price.toLocaleString()} &#1423;
            </div>
            <div className="text-sm text-muted-foreground font-armenian">
              {t('module.for-entire-course')}
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              {effectiveAccess ? (
                <>
                  <div className="text-center">
                    <div className="text-sm font-armenian mb-2">{t('module.your-progress')}</div>
                    <Progress value={0} className="mb-2" />
                    <div className="text-xs text-muted-foreground">0% {t('module.completed')}</div>
                  </div>
                  <Button className="w-full btn-modern font-armenian" onClick={onStartLearning}>
                    {t('module.start-learning')}
                  </Button>
                  {hasTempAccess && timeRemaining > 0 && (
                    <div className="text-center p-3 bg-warning-yellow/10 rounded-lg border border-warning-yellow/30">
                      <div className="text-sm font-medium text-warning-yellow font-armenian mb-1">
                        {t('module.temp-access')}
                      </div>
                      <div className="text-lg font-bold text-warning-yellow font-mono">
                        {formatTimeRemaining()}
                      </div>
                      <div className="text-xs text-warning-yellow/80 font-armenian">
                        {t('module.remaining-time')}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Button onClick={onEnroll} disabled={enrollModule.isPending} className="w-full btn-modern font-armenian">
                  {enrollModule.isPending ? t('module.enrolling') : t('module.enroll-now')}
                </Button>
              )}
            </div>
          ) : effectiveAccess ? (
            // Anonymous user with active access code session
            <div className="space-y-4">
              <Button className="w-full btn-modern font-armenian" onClick={onStartLearning}>
                {t('module.start-learning')}
              </Button>
              {hasTempAccess && timeRemaining > 0 && (
                <div className="text-center p-3 bg-warning-yellow/10 rounded-lg border border-warning-yellow/30">
                  <div className="text-sm font-medium text-warning-yellow font-armenian mb-1">
                    {t('module.temp-access')}
                  </div>
                  <div className="text-lg font-bold text-warning-yellow font-mono">
                    {formatTimeRemaining()}
                  </div>
                  <div className="text-xs text-warning-yellow/80 font-armenian">
                    {t('module.remaining-time')}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={onNavigateToAuth} className="w-full btn-modern font-armenian">
              {t('module.register-for-course')}
            </Button>
          )}

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between font-armenian">
              <span>{t('module.certificate')}:</span>
              <span>{t('module.yes')}</span>
            </div>
            <div className="flex justify-between font-armenian">
              <span>{t('module.access')}:</span>
              <span>{t('module.lifetime')}</span>
            </div>
            <div className="flex justify-between font-armenian">
              <span>{t('module.language')}:</span>
              <span>{t('module.armenian')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Code Section */}
      <Card className="border-dashed border-2 border-edu-blue/30 bg-gradient-to-br from-edu-blue/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-center font-armenian text-lg flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-edu-blue/10 text-edu-blue flex items-center justify-center text-sm">
              &#127873;
            </div>
            {t('module.temp-access')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-armenian mb-4">
              {t('module.temp-access-desc')}
            </p>
          </div>
          
          <CompanyCodeInput 
            onCodeVerified={handleTempCodeVerified} 
            moduleId={module.id}
          />
          
          <div className="text-xs text-center text-muted-foreground font-armenian border-t pt-3">
            {t('module.code-valid')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleDetailSidebar;
