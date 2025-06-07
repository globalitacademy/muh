
export const modulesList = [
  'Ալգորիթմների տարրերի կիրառում',
  'Ծրագրավորման հիմունքներ',
  'Օբյեկտ կողմնորոշված ծրագրավորման ներածություն',
  'Օբյեկտ կողմնորոշված մոդելի կիրառում',
  'Գրաֆիկական ինտերֆեյսի կիրառում',
  'Համակարգչային ցանցեր',
  'Ստատիկ վեբ կայքերի նախագծումը',
  'Ջավասկրիպտի կիրառումը',
  'Ռելյացիոն տվյալների բազաների նախագծում',
  'Ոչ Ռելյացիոն տվյալների բազաների նախագծում',
  'Դինամիկ վեբ կայքերի նախագծում',
  'Վեկտորային գրաֆիկա',
  'Կետային գրաֆիկա',
  'Տեղեկատվության անվտանգություն'
];

export const moduleMapping: Record<string, { icon: string; category: string }> = {
  'Ալգորիթմների տարրերի կիրառում': { icon: 'algorithm', category: 'ծրագրավորում' },
  'Ծրագրավորման հիմունքներ': { icon: 'code', category: 'ծրագրավորում' },
  'Օբյեկտ կողմնորոշված ծրագրավորման ներածություն': { icon: 'object', category: 'ծրագրավորում' },
  'Օբյեկտ կողմնորոշված մոդելի կիրառում': { icon: 'layers', category: 'ծրագրավորում' },
  'Գրաֆիկական ինտերֆեյսի կիրառում': { icon: 'layout-dashboard', category: 'դիզայն' },
  'Համակարգչային ցանցեր': { icon: 'network', category: 'ցանցեր' },
  'Ստատիկ վեբ կայքերի նախագծումը': { icon: 'file-text', category: 'վեբ' },
  'Ջավասկրիպտի կիրառումը': { icon: 'javascript', category: 'ծրագրավորում' },
  'Ռելյացիոն տվյալների բազաների նախագծում': { icon: 'database', category: 'տվյալներ' },
  'Ոչ Ռելյացիոն տվյալների բազաների նախագծում': { icon: 'database', category: 'տվյալներ' },
  'Դինամիկ վեբ կայքերի նախագծում': { icon: 'book', category: 'վեբ' },
  'Վեկտորային գրաֆիկա': { icon: 'vector', category: 'դիզայն' },
  'Կետային գրաֆիկա': { icon: 'image', category: 'դիզայն' },
  'Տեղեկատվության անվտանգություն': { icon: 'shield', category: 'անվտանգություն' }
};

export const getModuleIconName = (title: string): string => {
  return moduleMapping[title]?.icon || 'book';
};

export const getModuleCategory = (title: string): string => {
  return moduleMapping[title]?.category || 'ծրագրավորում';
};
