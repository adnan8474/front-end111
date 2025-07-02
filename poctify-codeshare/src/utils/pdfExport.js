import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function exportPDF(elementId) {
  return html2canvas(document.getElementById(elementId))
    .then(canvas => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      pdf.addImage(img, 'PNG', 10, 10, 280, 150);
      pdf.save('report.pdf');
    });
}
