declare module 'pdfjs-dist/web/pdf_viewer' {
  export function renderTextLayer(params: {
    textContentSource: any;
    container: HTMLElement;
    viewport: any;
    textDivs: any[];
  }): void;
}