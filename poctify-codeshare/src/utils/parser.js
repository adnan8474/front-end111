
import { matchHeaders } from './headerMatcher';
import { validateHeaders } from './validators';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import customParse from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParse);

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial);
  const total_seconds = Math.floor(86400 * fractional_day);
  const hours = Math.floor(total_seconds / 3600);
  const minutes = Math.floor((total_seconds - hours * 3600) / 60);
  const seconds = total_seconds - hours * 3600 - minutes * 60;
  date_info.setUTCHours(hours);
  date_info.setUTCMinutes(minutes);
  date_info.setUTCSeconds(seconds);
  return date_info;
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

  const cleaned = normalizedRows.map(row => {
    const raw = row.timestamp;
    let parsedDate;

    if (typeof raw === 'number') {
      parsedDate = excelDateToJSDate(raw);
    } else if (typeof raw === 'string') {
      parsedDate = dayjs(raw, 'DD/MM/YYYY HH:mm', true).toDate();
    } else {
      throw new Error(`Invalid timestamp: ${raw}`);
    }

    return {
      operator_id: String(row.operator_id || row.operatorid).trim(),
      timestamp: parsedDate,
      location: String(row.location).trim(),
      device: String(row.device).trim(),
      timestampRaw: raw,
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
