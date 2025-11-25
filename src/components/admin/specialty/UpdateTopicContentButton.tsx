import React from 'react';
import { Button } from '@/components/ui/button';
import { updateTopicContent } from '@/utils/updateTopicContent';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const UpdateTopicContentButton = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateTopicContent();
      
      if (result.success) {
        toast({
          title: 'Հաջողություն',
          description: 'Թեման հաջողությամբ թարմացվեց վարժություններով և վիկտորինայով',
        });
      } else {
        toast({
          title: 'Սխալ',
          description: 'Թեման թարմացնելիս սխալ տեղի ունեցավ',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Անսպասելի սխալ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdate} 
      disabled={loading}
      className="font-armenian"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Թարմացվում է...
        </>
      ) : (
        'Թարմացնել թեման վարժություններով և վիկտորինայով'
      )}
    </Button>
  );
};

export default UpdateTopicContentButton;
