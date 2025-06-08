
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface TopicErrorProps {
  error?: Error;
  notFound?: boolean;
}

const TopicError = ({ error, notFound }: TopicErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Վերադառնալ
        </Button>
        
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">
            {notFound ? 'Թեման չի գտնվել' : 'Սխալ'}
          </h2>
          <p className="text-muted-foreground font-armenian">
            {notFound 
              ? 'Խնդրված թեման գոյություն չունի կամ հեռացվել է'
              : `Սխալ է տեղի ունեցել տվյալները բեռնելիս: ${error?.message}`
            }
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TopicError;
