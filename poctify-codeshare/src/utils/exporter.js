import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { unparse } from 'papaparse';

export function downloadCSV(data, filename = 'report.csv') {
  const csv = unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function downloadPDF(elementId, filename = 'report.pdf') {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('landscape');
  pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
  pdf.save(filename);
}
