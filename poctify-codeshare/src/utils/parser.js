
import { matchHeaders } from './headerMatcher';
import { validateHeaders } from './validators';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import customParse from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParse);

// Excel numeric date conversion (Excel's epoch starts from 1899-12-30)
function excelDateToJSDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + serial * msPerDay);
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
