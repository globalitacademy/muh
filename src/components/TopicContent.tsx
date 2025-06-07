
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, FileText, Image, Code, CheckCircle } from 'lucide-react';

interface TopicContentProps {
  topicId: string;
  onComplete: () => void;
}

const TopicContent = ({ topicId, onComplete }: TopicContentProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const content = {
    video: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Ալգորիթմի սահմանումը - տեսանյութ դաս'
    },
    theory: {
      sections: [
        {
          id: 'definition',
          title: 'Ալգորիթմի սահմանումը',
          content: `
            <h3>Ինչ է ալգորիթմը?</h3>
            <p>Ալգորիթմը գործողությունների հստակ հաջորդականություն է, որն ուղղված է որոշակի խնդրի լուծմանը:</p>
            
            <h4>Ալգորիթմի հիմնական բնութագրիչները՝</h4>
            <ul>
              <li><strong>Մուտք (Input):</strong> Ալգորիթմը ստանում է մեկ կամ մի քանի մուտքային տվյալներ</li>
              <li><strong>Ելք (Output):</strong> Ալգորիթմը արտադրում է մեկ կամ մի քանի ելքային արդյունքներ</li>
              <li><strong>Որոշակիություն:</strong> Յուրաքանչյուր քայլ պետք է լինի հստակ և միանշանակ</li>
              <li><strong>Վերջնություն:</strong> Ալգորիթմը պետք է ավարտվի սահմանափակ քայլերից հետո</li>
              <li><strong>Արդյունավետություն:</strong> Ալգորիթմը պետք է լուծի խնդիրը ողջամիտ ժամանակում</li>
            </ul>
          `
        },
        {
          id: 'representation',
          title: 'Ալգորիթմների ներկայացման եղանակները',
          content: `
            <h3>Ալգորիթմների ներկայացման հիմնական եղանակները՝</h3>
            
            <h4>1. Բնական լեզվով նկարագրություն</h4>
            <p>Ալգորիթմը նկարագրվում է բնական լեզվով, քայլ առ քայլ:</p>
            
            <h4>2. Ալգորիթմական լեզու (Pseudocode)</h4>
            <p>Կիսաֆորմալ լեզու, որը համատեղում է բնական լեզվի պարզությունը և ծրագրավորման լեզվի ճշգրտությունը:</p>
            
            <h4>3. Հոսքի սխեմա (Flowchart)</h4>
            <p>Գրաֆիկական ներկայացում՝ բլոկ-սխեմաների միջոցով:</p>
            
            <h4>4. Ծրագրավորման լեզու</h4>
            <p>Ալգորիթմի ուղղակի իրականացումը որևէ ծրագրավորման լեզվով:</p>
          `
        }
      ]
    },
    examples: [
      {
        title: 'Օրինակ 1: Երկու թվի գումարման ալգորիթմ',
        content: `
          <h4>Բնական լեզվով:</h4>
          <ol>
            <li>Կարդալ առաջին թիվը (a)</li>
            <li>Կարդալ երկրորդ թիվը (b)</li>
            <li>Հաշվել գումարը (sum = a + b)</li>
            <li>Տպել արդյունքը</li>
          </ol>
          
          <h4>Pseudocode-ով:</h4>
          <pre><code>
BEGIN
    READ a
    READ b
    sum ← a + b
    PRINT sum
END
          </code></pre>
        `
      }
    ]
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      
      // If all sections are completed, enable the complete button
      if (newCompleted.length === content.theory.sections.length + content.examples.length) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <PlayCircle className="w-5 h-5 text-edu-blue" />
            Տեսանյութ դաս
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground font-armenian">Տեսանյութը շուտով կլինի հասանելի</p>
            </div>
          </div>
          <Button 
            onClick={() => markSectionComplete('video')}
            disabled={completedSections.includes('video')}
            className="w-full font-armenian"
          >
            {completedSections.includes('video') ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Տեսանյութը դիտված է
              </>
            ) : (
              'Նշել որպես դիտված'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Theory Content */}
      <Tabs defaultValue="theory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="theory" className="font-armenian">
            <FileText className="w-4 h-4 mr-2" />
            Տեսական նյութ
          </TabsTrigger>
          <TabsTrigger value="examples" className="font-armenian">
            <Code className="w-4 h-4 mr-2" />
            Օրինակներ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theory" className="space-y-4">
          {content.theory.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="font-armenian">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none font-armenian"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                <Button 
                  onClick={() => markSectionComplete(section.id)}
                  disabled={completedSections.includes(section.id)}
                  className="mt-4 font-armenian"
                  variant={completedSections.includes(section.id) ? "default" : "outline"}
                >
                  {completedSections.includes(section.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ավարտված
                    </>
                  ) : (
                    'Նշել որպես ավարտված'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          {content.examples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-armenian">{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none font-armenian"
                  dangerouslySetInnerHTML={{ __html: example.content }}
                />
                <Button 
                  onClick={() => markSectionComplete(`example-${index}`)}
                  disabled={completedSections.includes(`example-${index}`)}
                  className="mt-4 font-armenian"
                  variant={completedSections.includes(`example-${index}`) ? "default" : "outline"}
                >
                  {completedSections.includes(`example-${index}`) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ուսումնասիրված
                    </>
                  ) : (
                    'Նշել որպես ուսումնասիրված'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopicContent;
