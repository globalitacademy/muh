
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface TopicAccessDeniedProps {
  moduleId: string;
}

const TopicAccessDenied = ({ moduleId }: TopicAccessDeniedProps) => {
  const navigate = useNavigate();

  const handleBackToModule = () => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBackToModule}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Վերադառնալ մոդուլ
        </Button>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 font-armenian">Մուտքը սահմանափակ է</h2>
          <p className="text-muted-foreground font-armenian mb-6">
            Այս դասը հասանելի է միայն գրանցված ուսանողների համար
          </p>
          <Button 
            onClick={handleBackToModule}
            className="btn-modern font-armenian"
          >
            Վերադառնալ մոդուլ
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TopicAccessDenied;
