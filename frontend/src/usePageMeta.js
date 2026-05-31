import { useEffect } from 'react';

const DEFAULT_TITLE = 'Soeurs Finds — Boutique en ligne Canada | Vos trouvailles, notre passion';
const DEFAULT_DESCRIPTION =
  'Soeurs Finds — boutique en ligne au Canada. Cuisine, bien-être, lumière, sport, technologie et jardinage. Commandez en ligne, livraison partout au Canada.';

export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const prevTitle = document.title;
    const prevDescription = meta?.content || DEFAULT_DESCRIPTION;

    document.title = title || DEFAULT_TITLE;
    if (meta) meta.content = description || DEFAULT_DESCRIPTION;

    return () => {
      document.title = prevTitle;
      if (meta) meta.content = prevDescription;
    };
  }, [title, description]);
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };
