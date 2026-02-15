import React from 'react';
import AppLayout from '@/components/AppLayout';
import SpecialtiesList from '@/components/SpecialtiesList';
import { Star } from 'lucide-react';

const Specialties = () => {
  return (
    <AppLayout>
      <div className="py-16 md:py-24 w-full">
        <div className="content-container">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium font-armenian">{'\u0544\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0561\u056F\u0561\u0576 \u0578\u0582\u0572\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 font-armenian text-foreground leading-[1.2] py-2">
              {'\u0532\u0578\u056C\u0578\u0580 \u0574\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580\u0568'}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-armenian leading-relaxed px-4">
              {'\u0538\u0576\u057F\u0580\u0565\u0584 \u0571\u0565\u0580 \u0561\u057A\u0561\u0563\u0561 \u0574\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0587 \u057D\u056F\u057D\u0565\u0584 \u0578\u0582\u057D\u0578\u0582\u0574\u0568 \u0574\u0578\u0564\u0578\u0582\u056C\u0561\u0575\u056B\u0576 \u0574\u0578\u057F\u0565\u0581\u0574\u0561\u0574\u0562'}
            </p>
          </div>
          
          <SpecialtiesList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Specialties;