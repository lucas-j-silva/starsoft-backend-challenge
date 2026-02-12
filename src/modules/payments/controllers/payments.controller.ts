import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { ListPaymentsWithPaginationAndFilterQueryDto } from '../dtos';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async listWithPaginationAndFilter(
    @Query() query: ListPaymentsWithPaginationAndFilterQueryDto,
    @Session() session: UserSession,
  ) {
    return this.paymentsService.listWithPaginationAndFilter({
      page: query.page,
      limit: query.limit,
      status: query.status,
      userId: session.user.id,
    });
  }

  @Put(':idOrExternalId/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  async approvePayment(@Param('idOrExternalId') idOrExternalId: string) {
    return this.paymentsService.approvePayment({ idOrExternalId });
  }
}
