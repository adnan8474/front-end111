export function matchHeaders(rawKeys) {
  const normalized = rawKeys.map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const map = {};
  ['operatorid', 'timestamp', 'location', 'device'].forEach((key) => {
    const idx = normalized.indexOf(key);
    if (idx === -1) {
      throw new Error(`Missing column: ${key}`);
    }
    map[key] = rawKeys[idx];
  });
  return map;
}
