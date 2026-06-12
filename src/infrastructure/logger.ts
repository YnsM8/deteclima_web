export interface LogPayload {
  message: string;
  context?: string;
  error?: any;
  [key: string]: any;
}

class StructuredLogger {
  private formatLog(level: 'info' | 'warn' | 'error', payload: LogPayload) {
    const { message, context, error, ...extra } = payload;
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context || 'General',
      error: error ? {
        message: error.message || String(error),
        stack: error.stack || undefined
      } : undefined,
      ...extra
    });
  }

  info(message: string, context?: string, extra?: Record<string, any>) {
    console.log(this.formatLog('info', { message, context, ...extra }));
  }

  warn(message: string, context?: string, extra?: Record<string, any>) {
    console.warn(this.formatLog('warn', { message, context, ...extra }));
  }

  error(message: string, context?: string, error?: any, extra?: Record<string, any>) {
    console.error(this.formatLog('error', { message, context, error, ...extra }));
  }
}

export const logger = new StructuredLogger();
