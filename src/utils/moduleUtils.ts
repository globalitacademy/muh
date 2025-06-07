export const getModuleIcon = (category: string, title?: string) => {
  // First check by title for more specific matching
  if (title) {
    const lowerTitle = title.toLowerCase();
    
    // Programming related
    if (lowerTitle.includes('javascript') || lowerTitle.includes('js')) return '🟨';
    if (lowerTitle.includes('python')) return '🐍';
    if (lowerTitle.includes('java')) return '☕';
    if (lowerTitle.includes('c++') || lowerTitle.includes('c#')) return '⚡';
    if (lowerTitle.includes('react') || lowerTitle.includes('vue') || lowerTitle.includes('angular')) return '⚛️';
    if (lowerTitle.includes('node')) return '🟢';
    if (lowerTitle.includes('html') || lowerTitle.includes('css')) return '🌐';
    
    // Database and data
    if (lowerTitle.includes('sql') || lowerTitle.includes('database') || lowerTitle.includes('տվյալ')) return '🗄️';
    if (lowerTitle.includes('mongodb') || lowerTitle.includes('nosql')) return '🍃';
    
    // Mobile development
    if (lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('mobile')) return '📱';
    if (lowerTitle.includes('flutter') || lowerTitle.includes('react native')) return '📲';
    
    // DevOps and tools
    if (lowerTitle.includes('git') || lowerTitle.includes('github')) return '🐙';
    if (lowerTitle.includes('docker')) return '🐳';
    if (lowerTitle.includes('aws') || lowerTitle.includes('cloud')) return '☁️';
    
    // Design and UI/UX
    if (lowerTitle.includes('photoshop') || lowerTitle.includes('figma')) return '🎨';
    if (lowerTitle.includes('ui') || lowerTitle.includes('ux') || lowerTitle.includes('դիզայն')) return '🎭';
    
    // Security
    if (lowerTitle.includes('անվտանգություն') || lowerTitle.includes('security')) return '🔐';
    if (lowerTitle.includes('encryption') || lowerTitle.includes('cyber')) return '🛡️';
    
    // AI and Machine Learning
    if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('ml')) return '🤖';
    if (lowerTitle.includes('neural') || lowerTitle.includes('deep learning')) return '🧠';
    
    // Testing
    if (lowerTitle.includes('test') || lowerTitle.includes('qa')) return '🧪';
    
    // API and Backend
    if (lowerTitle.includes('api') || lowerTitle.includes('backend')) return '🔗';
    if (lowerTitle.includes('microservice')) return '⚙️';
  }
  
  // Fall back to category-based icons
  switch (category) {
    case 'ծրագրավորում':
      return '💻';
    case 'վեբ':
      return '🌐';
    case 'տվյալներ':
      return '🗄️';
    case 'ցանցեր':
      return '🌐';
    case 'անվտանգություն':
      return '🔐';
    case 'դիզայն':
    case 'UI/UX':
      return '🎨';
    case 'mobile':
      return '📱';
    case 'ai':
      return '🤖';
    default:
      return '📚';
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
