import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export const MAX_PDF_BYTES = 2 * 1024 * 1024;
export const MAX_EXTRACTED_CHARS = 30000;

export async function extractPdfText(file: File): Promise<string> {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('File is larger than 2 MB. Please upload a smaller file.');
  }
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str ?? '' : ''))
      .join(' ');
    text += pageText + '\n\n';
    if (text.length > MAX_EXTRACTED_CHARS) break;
  }
  const cleaned = text.trim();
  if (!cleaned) {
    throw new Error(
      'No readable text found in this PDF. Try a text-based PDF (not scanned).',
    );
  }
  return cleaned.slice(0, MAX_EXTRACTED_CHARS);
}

export async function extractTextFile(file: File): Promise<string> {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('File is larger than 2 MB. Please upload a smaller file.');
  }
  const text = await file.text();
  return text.slice(0, MAX_EXTRACTED_CHARS);
}

export async function extractFile(file: File): Promise<string> {
  const isPdf =
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (isPdf) return extractPdfText(file);
  return extractTextFile(file);
}
