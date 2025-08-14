export const SOURCE_LABELS: Record<string, string> = {
  'https://akademieprotokolle.acdh.oeaw.ac.at/': 'Academy Protocols',
  'https://amp.acdh.oeaw.ac.at/': 'AMP',
  'https://gtrans.acdh.oeaw.ac.at/': 'German Translations',
  'https://hanslick.acdh.oeaw.ac.at/': 'Hanslick Project',
  'https://kaiserin-eleonora.oeaw.ac.at/': 'Kaiserin Eleonora',
  'https://oebl-pfp.acdh-ch-dev.oeaw.ac.at/': 'Austrian Biographical Lexicon',
  'https://parlamint.acdh.oeaw.ac.at/': 'ParlaMint',
  'https://pmb.acdh.oeaw.ac.at/': 'PMB',
  'https://staribacher.acdh.oeaw.ac.at/': 'Staribacher Diaries',
  'https://tillich.acdh.oeaw.ac.at/': 'Tillich Correspondence',
  'https://wmp1.acdh.oeaw.ac.at/': 'WMP1'
};

export const getSourceLabel = (url : string): string => {
  const baseUrl = Object.keys(SOURCE_LABELS).find(base => url.startsWith(base));
  return baseUrl ? SOURCE_LABELS[baseUrl] : url;
};