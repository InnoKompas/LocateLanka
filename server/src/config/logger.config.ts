import { LOGGING, IS_PRODUCTION } from './environment.config';

export interface Logger {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  http(message: string, meta?: any): void;
}

class ConsoleLogger implements Logger {
  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(LOGGING.LEVEL);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    
    if (IS_PRODUCTION) {
      return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        message,
        ...(meta && { meta })
      });
    } else {
      const colors = {
        error: '\x1b[31m', // Red
        warn: '\x1b[33m',  // Yellow
        info: '\x1b[36m',  // Cyan
        debug: '\x1b[35m', // Magenta
        http: '\x1b[32m'   // Green
      };
      const reset = '\x1b[0m';
      const color = colors[level as keyof typeof colors] || '';
      
      return `${color}[${timestamp}] ${level.toUpperCase()}:${reset} ${message}${metaStr}`;
    }
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  http(message: string, meta?: any): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('http', message, meta));
    }
  }
}

export const logger: Logger = new ConsoleLogger();
