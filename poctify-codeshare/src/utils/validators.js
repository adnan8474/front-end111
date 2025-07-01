export function validateHeaders(keys) {
  const required = ['operator_id', 'timestamp', 'location', 'device'];
  const missing = required.filter(k => !keys.includes(k));
  if (missing.length) {
    throw new Error(`Missing column(s): ${missing.join(', ')}`);
  }
}
