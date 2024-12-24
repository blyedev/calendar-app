import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  log(...args: Parameters<typeof console.log>): void {
    console.log(...args);
  }

  info(...args: Parameters<typeof console.info>): void {
    console.info(...args);
  }

  warn(...args: Parameters<typeof console.warn>): void {
    console.warn(...args);
  }

  error(...args: Parameters<typeof console.error>): void {
    console.error(...args);
  }
}
