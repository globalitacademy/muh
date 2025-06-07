
export const getModuleIcon = (category: string) => {
  switch (category) {
    case 'ծրագրավորում':
      return '< >';
    case 'վեբ':
      return '📝';
    case 'տվյալներ':
      return '🗃️';
    case 'ցանցեր':
    case 'անվտանգություն':
      return '🌐';
    case 'դիզայն':
    case 'UI/UX':
      return '🎨';
    default:
      return '💻';
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
