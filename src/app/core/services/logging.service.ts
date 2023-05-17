import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logLevel = LogLevel.DEBUG;

  constructor() {}

  debug(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug('DEBUG: ' + message, optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info('INFO: ' + message, optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn('WARN: ' + message, optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error('ERROR: ' + message, optionalParams);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }
}
