import { matchHeaders } from './headerMatcher';
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

  const requiredHeaders = ['operator_id', 'timestamp', 'location', 'device'];
  const cleanedHeaders = headerRow.map(h => h?.toString().trim().toLowerCase());

  const missing = requiredHeaders.filter(col => !cleanedHeaders.includes(col));
  if (missing.length) {
    throw new Error(`Missing column(s): ${missing.join(', ')}`);
  }

  const normalizedRows = dataRows.map(row => {
    const rowData = {};
    headerRow.forEach((label, idx) => {
      const key = label?.toString().trim().toLowerCase();
      if (requiredHeaders.includes(key)) {
        rowData[key] = row[idx];
      }
    });

    const raw = rowData.timestamp;
    let parsedDate;

    if (typeof raw === 'number') {
      parsedDate = excelDateToJSDate(raw);
    } else if (typeof raw === 'string') {
      parsedDate = dayjs(raw, 'DD/MM/YYYY HH:mm', true).toDate();
    }

    if (!parsedDate || isNaN(parsedDate)) {
      throw new Error(`Invalid timestamp: ${raw}`);
    }

    rowData.timestamp = parsedDate;
    return rowData;
  });

  return cleaned;
}
