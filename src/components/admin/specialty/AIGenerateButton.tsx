import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIGenerateButtonProps {
  topicTitle: string;
  type: 'content' | 'exercises' | 'quiz' | 'resources';
  onGenerated: (data: any) => void;
  disabled?: boolean;
}

const AIGenerateButton = ({ topicTitle, type, onGenerated, disabled }: AIGenerateButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const labels = {
    content: 'Գեներացնել բովանդակություն',
    exercises: 'Գեներացնել վարժություններ',
    quiz: 'Գեներացնել վիկտորինա',
    resources: 'Գեներացնել ռեսուրսներ'
  };

  const handleGenerate = async () => {
    if (!topicTitle.trim()) {
      toast({
        title: 'Սխալ',
        description: 'Նախ լրացրեք թեմայի վերնագիրը',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-topic-content', {
        body: {
          topicTitle,
          type,
          language: 'hy'
        }
      });

      if (error) throw error;

      if (data) {
        onGenerated(data);
        toast({
          title: 'Հաջողություն',
          description: 'Բովանդակությունը հաջողությամբ գեներացվեց',
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Սխալ',
        description: error instanceof Error ? error.message : 'Գեներացիայի ժամանակ սխալ տեղի ունեցավ',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGenerate}
      disabled={disabled || isGenerating || !topicTitle.trim()}
      variant="outline"
      size="sm"
      className="font-armenian"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Գեներացվում է...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          {labels[type]}
        </>
      )}
    </Button>
  );
};

export default AIGenerateButton;
