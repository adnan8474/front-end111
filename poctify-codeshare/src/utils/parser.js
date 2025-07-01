import { matchHeaders } from './headerMatcher';
import { validateHeaders } from './validators';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import customParse from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParse);

export async function parseFile(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (!rows.length) throw new Error('Empty file');
  const [headerRow, ...dataRows] = rows;
  const headerMap = matchHeaders(headerRow);
  validateHeaders(Object.keys(headerMap));

  const normalizedRows = dataRows.map(r => {
    const obj = {};
    Object.entries(headerMap).forEach(([key, label]) => {
      const idx = headerRow.indexOf(label);
      obj[key] = r[idx];
    });
    return obj;
  });

 j0t95t-codex/set-up-frontend-project-with-vite,-react,-and-tailwind-css
  const cleaned = normalizedRows.map((row, idx) => {
    const timestampRaw = row.timestamp;
    const requiredFields = ['operator_id', 'timestamp', 'location', 'device'];

    for (const field of requiredFields) {
      const value = row[field] || row[field.replace('_', '')];
      if (value === undefined || value === '') {
        throw new Error(`Row ${idx + 2} missing ${field}`);
      }
    }

    const parsed = dayjs(timestampRaw, 'DD/MM/YYYY HH:mm');
    console.log('Parsed row:', row);
    console.log('Parsed timestamp:', parsed.format());
    if (!parsed.isValid()) {
      throw new Error(`Invalid timestamp: ${timestampRaw}`);
    }

    return {
      operator_id: String(row.operator_id || row.operatorid).trim(),
      timestamp: parsed.toDate(),

  const cleaned = normalizedRows.map(row => {
    const timestampRaw = row.timestamp;
    return {
      operator_id: String(row.operator_id || row.operatorid).trim(),
      timestamp: dayjs(timestampRaw, 'DD/MM/YYYY HH:mm').toDate(),
 main
      location: String(row.location).trim(),
      device: String(row.device).trim(),
      timestampRaw,
    };
  });

  cleaned.sort((a, b) => {
    if (a.operator_id === b.operator_id) {
      return a.timestamp - b.timestamp;
    }
    return a.operator_id.localeCompare(b.operator_id);
  });

  return cleaned;
}
