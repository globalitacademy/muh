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
  BookOpen
} from 'lucide-react';

export const getModuleIcon = (category: string, title?: string) => {
  // First check by title for more specific matching
  if (title) {
    const lowerTitle = title.toLowerCase();
    
    // Programming related
    if (lowerTitle.includes('javascript') || lowerTitle.includes('js')) {
      return React.createElement(Code, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('python')) {
      return React.createElement(Code, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('java')) {
      return React.createElement(Code, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('c++') || lowerTitle.includes('c#')) {
      return React.createElement(Code, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('react') || lowerTitle.includes('vue') || lowerTitle.includes('angular')) {
      return React.createElement(Code, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('node')) {
      return React.createElement(Server, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('html') || lowerTitle.includes('css')) {
      return React.createElement(Globe, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // Database and data
    if (lowerTitle.includes('sql') || lowerTitle.includes('database') || lowerTitle.includes('տվյալ')) {
      return React.createElement(Database, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('mongodb') || lowerTitle.includes('nosql')) {
      return React.createElement(Database, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // Mobile development
    if (lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('mobile')) {
      return React.createElement(Smartphone, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('flutter') || lowerTitle.includes('react native')) {
      return React.createElement(Smartphone, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // DevOps and tools
    if (lowerTitle.includes('git') || lowerTitle.includes('github')) {
      return React.createElement(GitBranch, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('docker')) {
      return React.createElement(Settings, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('aws') || lowerTitle.includes('cloud')) {
      return React.createElement(Cloud, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // Design and UI/UX
    if (lowerTitle.includes('photoshop') || lowerTitle.includes('figma')) {
      return React.createElement(Palette, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('ui') || lowerTitle.includes('ux') || lowerTitle.includes('դիզայն')) {
      return React.createElement(Palette, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // Security
    if (lowerTitle.includes('անվտանգություն') || lowerTitle.includes('security')) {
      return React.createElement(Shield, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('encryption') || lowerTitle.includes('cyber')) {
      return React.createElement(Shield, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // AI and Machine Learning
    if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('ml')) {
      return React.createElement(Brain, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('neural') || lowerTitle.includes('deep learning')) {
      return React.createElement(Brain, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // Testing
    if (lowerTitle.includes('test') || lowerTitle.includes('qa')) {
      return React.createElement(TestTube, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    
    // API and Backend
    if (lowerTitle.includes('api') || lowerTitle.includes('backend')) {
      return React.createElement(Link, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
    if (lowerTitle.includes('microservice')) {
      return React.createElement(Settings, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    }
  }
  
  // Fall back to category-based icons
  switch (category) {
    case 'ծրագրավորում':
      return React.createElement(Code, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'վեբ':
      return React.createElement(Globe, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'տվյալներ':
      return React.createElement(Database, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'ցանցեր':
      return React.createElement(Globe, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'անվտանգություն':
      return React.createElement(Shield, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'դիզայն':
    case 'UI/UX':
      return React.createElement(Palette, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'mobile':
      return React.createElement(Smartphone, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    case 'ai':
      return React.createElement(Brain, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
    default:
      return React.createElement(BookOpen, {
        width: 32,
        height: 32,
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      });
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
