import { matchHeaders } from './headerMatcher';
import { validateHeaders } from './validators';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import customParse from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParse);

function isExcelSerial(value) {
  const num = typeof value === 'number' ? value : parseFloat(value);
  return !isNaN(num) && num > 30000 && num < 60000;
}

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  const total_seconds = Math.floor(86400 * fractional_day);
  const hours = Math.floor(total_seconds / 3600);
  const minutes = Math.floor((total_seconds - hours * 3600) / 60);
  const seconds = total_seconds - hours * 3600 - minutes * 60;
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds) + utc_value * 1000);
}

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

  const cleaned = normalizedRows.map((row, idx) => {
    const timestampRaw = row.timestamp;
    const requiredFields = ['operator_id', 'timestamp', 'location', 'device'];

    for (const field of requiredFields) {
      const value = row[field];
      if (value === undefined || value === '') {
        throw new Error(`Row ${idx + 2} missing ${field}`);
      }
    }

    let parsed = dayjs(timestampRaw, 'DD/MM/YYYY HH:mm', true);
    if (!parsed.isValid() && isExcelSerial(timestampRaw)) {
      const num = typeof timestampRaw === 'number' ? timestampRaw : parseFloat(timestampRaw);
      parsed = dayjs(excelDateToJSDate(num));
    }
    console.log('Parsed row:', row);
    console.log('Parsed timestamp:', parsed ? parsed.format() : 'invalid');
    if (!parsed || !parsed.isValid()) {
      throw new Error(`Invalid timestamp: ${timestampRaw}`);
    }

    return {
      operator_id: String(row.operator_id).trim(),
      timestamp: parsed.toDate(),
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
