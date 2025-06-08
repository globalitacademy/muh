
import React from 'react';

interface CertificateRendererProps {
  templateName: string;
  templateType: 'certificate' | 'diploma' | 'participation';
  designConfig: any;
  sampleData?: {
    studentName?: string;
    courseName?: string;
    date?: string;
    instructorName?: string;
  };
}

const CertificateRenderer = ({ 
  templateName, 
  templateType, 
  designConfig,
  sampleData = {
    studentName: "Անի Հովսեփյան",
    courseName: "Ծրագրավորման հիմունքներ",
    date: new Date().toLocaleDateString('hy-AM'),
    instructorName: "Արմեն Գրիգորյան"
  }
}: CertificateRendererProps) => {
  
  // Default template styles based on type
  const getDefaultTemplate = () => {
    const baseStyles = {
      width: '100%',
      height: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: '8px solid #2c3e50',
      borderRadius: '12px',
      padding: '40px',
      color: 'white',
      fontFamily: 'serif',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center' as const,
      position: 'relative' as const,
    };

    switch (templateType) {
      case 'diploma':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: '8px solid #8b5cf6',
        };
      case 'participation':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          border: '8px solid #059669',
        };
      default:
        return baseStyles;
    }
  };

  const getTypeTitle = () => {
    switch (templateType) {
      case 'certificate':
        return 'ԱՎԱՐՏԱԿԱՆ ՎԿԱՅԱԿԱՆ';
      case 'diploma':
        return 'ԴԻՊԼՈՄ';
      case 'participation':
        return 'ՄԱՍՆԱԿՑՈՒԹՅԱՆ ՎԿԱՅԱԿԱՆ';
      default:
        return 'ՎԿԱՅԱԿԱՆ';
    }
  };

  // Try to parse design config, fallback to default
  let appliedStyles = getDefaultTemplate();
  
  if (designConfig && typeof designConfig === 'object') {
    try {
      // If design_config has specific styling, apply it
      if (designConfig.styles) {
        appliedStyles = { ...appliedStyles, ...designConfig.styles };
      }
      if (designConfig.background) {
        appliedStyles.background = designConfig.background;
      }
      if (designConfig.borderColor) {
        appliedStyles.border = `8px solid ${designConfig.borderColor}`;
      }
    } catch (error) {
      console.warn('Could not parse design config, using default template');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div style={appliedStyles}>
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-400 opacity-75"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-400 opacity-75"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-400 opacity-75"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-400 opacity-75"></div>

        {/* Certificate Content */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-widest">
            {getTypeTitle()}
          </h1>
          
          <div className="text-lg">
            Սույնով վկայում ենք, որ
          </div>
          
          <div className="text-3xl font-bold underline decoration-yellow-400 decoration-2 underline-offset-4">
            {sampleData.studentName}
          </div>
          
          <div className="text-lg">
            հաջողությամբ ավարտել է
          </div>
          
          <div className="text-2xl font-semibold text-yellow-300">
            «{sampleData.courseName}»
          </div>
          
          <div className="text-base">
            դասընթացը և ստացել է համապատասխան գնահատական
          </div>
          
          <div className="flex justify-between items-end w-full mt-12 text-sm">
            <div className="text-left">
              <div className="border-t border-yellow-400 pt-2 min-w-[120px]">
                Ուսուցիչ
              </div>
              <div className="mt-1 font-semibold">
                {sampleData.instructorName}
              </div>
            </div>
            
            <div className="text-right">
              <div className="border-t border-yellow-400 pt-2 min-w-[120px]">
                Ամսաթիվ
              </div>
              <div className="mt-1 font-semibold">
                {sampleData.date}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Template Info */}
      <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center font-armenian">
        Նախադիտում՝ {templateName} շաբլոն
      </div>
    </div>
  );
};

export default CertificateRenderer;
