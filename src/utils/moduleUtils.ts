
import React from 'react';
import { 
  Code, 
  Globe, 
  Database, 
  Shield, 
  Palette, 
  Smartphone, 
  Brain, 
  Server, 
  GitBranch, 
  Cloud,
  TestTube,
  Link,
  Settings,
  BookOpen,
  Layers,
  LayoutDashboard,
  Network,
  FileText,
  Image,
  Zap,
  Monitor,
  Lock,
  Cpu,
  FileCode,
  Workflow,
  Bot
} from 'lucide-react';

// Icon mapping for dynamic icon display
const iconMap = {
  'Code': Code,
  'BookOpen': BookOpen,
  'Database': Database,
  'Globe': Globe,
  'Layers': Layers,
  'Monitor': Monitor,
  'Smartphone': Smartphone,
  'Server': Server,
  'Lock': Lock,
  'Cloud': Cloud,
  'Cpu': Cpu,
  'FileCode': FileCode,
  'Workflow': Workflow,
  'Shield': Shield,
  'Palette': Palette,
  'Network': Network,
  'Bot': Bot,
  'Brain': Brain,
  'Zap': Zap,
  'Settings': Settings,
  'LayoutDashboard': LayoutDashboard,
  'FileText': FileText,
  'Image': Image,
  'TestTube': TestTube,
  'GitBranch': GitBranch,
  'Link': Link
};

// Get icon from database icon field
export const getModuleIconFromDb = (iconName?: string) => {
  const iconProps = {
    width: 32,
    height: 32,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  if (iconName && iconMap[iconName as keyof typeof iconMap]) {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return React.createElement(IconComponent, iconProps);
  }

  // Default to Code icon if not found
  return React.createElement(Code, iconProps);
};

export const getModuleIcon = (category?: string, title?: string) => {
  const iconProps = {
    width: 32,
    height: 32,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  // Map specific module titles to icons
  if (title) {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('ալգորիթմ')) {
      return React.createElement(Zap, iconProps);
    }
    if (lowerTitle.includes('ծրագրավորման հիմունք')) {
      return React.createElement(Code, iconProps);
    }
    if (lowerTitle.includes('օբյեկտ կողմնորոշված ծրագրավորման ներածություն')) {
      return React.createElement(Layers, iconProps);
    }
    if (lowerTitle.includes('օբյեկտ կողմնորոշված մոդելի կիրառում')) {
      return React.createElement(Settings, iconProps);
    }
    if (lowerTitle.includes('գրաֆիկական ինտերֆեյս')) {
      return React.createElement(LayoutDashboard, iconProps);
    }
    if (lowerTitle.includes('համակարգչային ցանց')) {
      return React.createElement(Network, iconProps);
    }
    if (lowerTitle.includes('ստատիկ վեբ')) {
      return React.createElement(FileText, iconProps);
    }
    if (lowerTitle.includes('ջավասկրիպտ')) {
      return React.createElement(Code, iconProps);
    }
    if (lowerTitle.includes('ռելյացիոն տվյալների բազա')) {
      return React.createElement(Database, iconProps);
    }
    if (lowerTitle.includes('ոչ ռելյացիոն')) {
      return React.createElement(Database, iconProps);
    }
    if (lowerTitle.includes('դինամիկ վեբ')) {
      return React.createElement(Globe, iconProps);
    }
    if (lowerTitle.includes('վեկտորային գրաֆիկա')) {
      return React.createElement(Palette, iconProps);
    }
    if (lowerTitle.includes('կետային գրաֆիկա')) {
      return React.createElement(Image, iconProps);
    }
    if (lowerTitle.includes('տեղեկատվության անվտանգություն')) {
      return React.createElement(Shield, iconProps);
    }
  }
  
  // Fall back to category-based icons
  switch (category) {
    case 'ծրագրավորում':
      return React.createElement(Code, iconProps);
    case 'վեբ':
      return React.createElement(Globe, iconProps);
    case 'տվյալներ':
      return React.createElement(Database, iconProps);
    case 'ցանցեր':
      return React.createElement(Network, iconProps);
    case 'անվտանգություն':
      return React.createElement(Shield, iconProps);
    case 'դիզայն':
    case 'UI/UX':
      return React.createElement(Palette, iconProps);
    case 'mobile':
      return React.createElement(Smartphone, iconProps);
    case 'ai':
      return React.createElement(Brain, iconProps);
    default:
      return React.createElement(BookOpen, iconProps);
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ծրագրավորում':
      return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    case 'վեբ':
      return 'from-green-500/20 to-green-600/20 border-green-500/30';
    case 'տվյալներ':
      return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
    case 'ցանցեր':
    case 'անվտանգություն':
      return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
    case 'դիզայն':
    case 'UI/UX':
      return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
    default:
      return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  }
};

export const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-success-green/20 text-success-green border-success-green/30';
    case 'intermediate':
      return 'bg-warning-yellow/20 text-warning-yellow border-warning-yellow/30';
    case 'advanced':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const getDifficultyText = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'Սկսնակ';
    case 'intermediate':
      return 'Միջին';
    case 'advanced':
      return 'Բարձր';
    default:
      return level;
  }
};
