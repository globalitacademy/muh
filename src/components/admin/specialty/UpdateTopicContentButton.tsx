import React from 'react';
import { Button } from '@/components/ui/button';
import { updateTopicContent } from '@/utils/updateTopicContent';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const BUTTON_TEXT = '\u0539\u0561\u0580\u0574\u0561\u0581\u0576\u0565\u056C \u0569\u0565\u0574\u0561\u0576';
const LOADING_TEXT = '\u0539\u0561\u0580\u0574\u0561\u0581\u057E\u0578\u0582\u0574 \u0567...';

const UpdateTopicContentButton = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateTopicContent();
      
      if (result.success) {
        toast({
          title: '\u0540\u0561\u057B\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576',
          description: '\u0539\u0565\u0574\u0561\u0576 \u0570\u0561\u057B\u0578\u0572\u0578\u0582\u0569\u0575\u0561\u0574\u0562 \u0569\u0561\u0580\u0574\u0561\u0581\u057E\u0565\u0581 \u057E\u0561\u0580\u056A\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580\u0578\u057E \u0587 \u057E\u056B\u056F\u057F\u0578\u0580\u056B\u0576\u0561\u0575\u0578\u057E',
        });
      } else {
        toast({
          title: '\u054D\u056D\u0561\u056C',
          description: '\u0539\u0565\u0574\u0561\u0576 \u0569\u0561\u0580\u0574\u0561\u0581\u0576\u0565\u056C\u056B\u057D \u057D\u056D\u0561\u056C \u057F\u0565\u0572\u056B \u0578\u0582\u0576\u0565\u0581\u0561\u057E',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '\u054D\u056D\u0561\u056C',
        description: '\u0531\u0576\u057D\u057A\u0561\u057D\u0565\u056C\u056B \u057D\u056D\u0561\u056C',
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
          {LOADING_TEXT}
        </>
      ) : (
        BUTTON_TEXT
      )}
    </Button>
  );
};

export default UpdateTopicContentButton;
