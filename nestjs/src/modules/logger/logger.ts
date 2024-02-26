import {LoggerService} from '@nestjs/common';
import * as winston from 'winston';
import {format, Logger as WinstonLogger} from 'winston';

export class Logger implements LoggerService { // todo do we want to use something like winston?

  private readonly logger: WinstonLogger;

  private readonly loggerOptions = {
    level: 'debug',
    format: format.combine(
      winston.format.timestamp(),
      format.errors({stack: true}),
      format.metadata(),
      format.splat(),
      format.json(),
    ),
    transports: [
      new winston.transports.Console(),
    ]
  };

  constructor() {
    this.logger = winston.createLogger(this.loggerOptions);
  }

  log(...args: any) {
    console.log('Logger log:', ...args);
    this.logger.info.call(this.logger, args);
  }

  info(...args: any) {
    console.log('Logger info:', ...args);
    this.logger.info.call(this.logger, args);
  }

  error(...args: any) {
    console.log('Logger error:', ...args);
    this.logger.error.call(this.logger, args);
  }

  warn(...args: any) {
    console.log('Logger warn:', ...args);
    this.logger.warn.call(this.logger, args);
  }

  debug(...args: any) {
    console.log('Logger debug:', ...args);
    this.logger.debug.call(this.logger, args);
  }

  verbose(...args: any) {
    console.log('Logger verbose:', ...args);
    this.logger.info.call(this.logger, args);
  }
}
