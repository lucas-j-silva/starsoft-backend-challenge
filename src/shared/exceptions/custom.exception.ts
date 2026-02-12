import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  private readonly args?: Record<string, unknown>;

  constructor(message: string, code: number, args?: Record<string, unknown>) {
    super(message, code);

    this.args = args;
  }

  getArgs(): Record<string, unknown> | undefined {
    return this.args;
  }
}
