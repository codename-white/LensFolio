/**
 * LensFolio Image Resolution Utility
 * Designed to handle both local bundled assets and remote Supabase URLs.
 */

const LOCAL_MODELS: Record<string, any> = {
  'yaya.png': require('../assets/model/yaya.png'),
  'baifren.png': require('../assets/model/baifren.png'),
  'baifern.png': require('../assets/model/baifren.png'), // Handle common spelling variations
  'mai.png': require('../assets/model/mai.png'),
  'bow.png': require('../assets/model/bow.png'),
};

/**
 * Resolves an image source from a path or URL.
 * If the path matches a local model asset, it returns the require() call.
 * Otherwise, it returns the standard { uri } object for remote loading.
 * 
 * @param pathOrUrl Filename (e.g., 'yaya.png') or full URL
 */
export const resolveImageSource = (pathOrUrl: string | undefined | null) => {
  if (!pathOrUrl) return null;

  // Check if it's a local model asset
  if (LOCAL_MODELS[pathOrUrl.toLowerCase()]) {
    return LOCAL_MODELS[pathOrUrl.toLowerCase()];
  }

  // Check if it's already a full URL or a relative path that should be treated as a URI
  if (pathOrUrl.startsWith('http') || pathOrUrl.startsWith('https') || pathOrUrl.startsWith('file://')) {
    return { uri: pathOrUrl };
  }

  // Default to treating as a URI if it doesn't match local mapping
  return { uri: pathOrUrl };
};
