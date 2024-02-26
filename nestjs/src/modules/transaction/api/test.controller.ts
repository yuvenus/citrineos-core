import {Controller, Get, Logger} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";

@Controller('test')
export class TestController {

  private readonly logger = new Logger(TestController.name);

  @Get()
  test(): string {
    return 'hello';
  }

  @EventPattern('user_created')
  async handleUserCreated(data: Record<string, unknown>) {
    this.logger.log('handleUserCreated', data);
  }
}
