// tesseract.d.ts
declare module 'tesseract.js/dist/worker.min.js' {
  import { Worker } from 'tesseract.js';

  export function createWorker(options: { workerPath: string, corePath: string }): Promise<Worker>;
}
