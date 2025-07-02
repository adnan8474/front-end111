export function matchHeaders(rawKeys) {
  const normalized = rawKeys.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const map = {};
  const required = {
    operator_id: 'operatorid',
    timestamp: 'timestamp',
    location: 'location',
    device: 'device',
  };

  Object.entries(required).forEach(([canonical, match]) => {
    const idx = normalized.indexOf(match);
    if (idx === -1) {
      throw new Error(`Missing column: ${canonical}`);
    }
    map[canonical] = rawKeys[idx];
  });

  return map;
}
