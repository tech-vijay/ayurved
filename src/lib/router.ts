import { useState, useEffect } from 'react';

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const handler = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const path = hash.replace(/^#/, '') || '/';
  return path;
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function parseRoute(path: string): { segments: string[]; query: Record<string, string> } {
  const [pathPart, queryPart] = path.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const query: Record<string, string> = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => { query[k] = v; });
  }
  return { segments, query };
}
