import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { ListPaymentsWithPaginationAndFilterQueryDto } from '../dtos';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  PaymentApiSchema,
  PaymentsPaginationResultApiSchema,
} from '../swagger/schemas';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a payment by ID',
    description: 'Retrieves a payment by its unique identifier',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The payment has been successfully retrieved.',
    type: PaymentApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The payment with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async findPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.paymentsService.findPayment({ id, userId: session.user.id });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List payments with pagination and filter',
    description: 'Lists all payments with pagination and filter',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments listed successfully',
    type: PaymentsPaginationResultApiSchema,
  })
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
  @ApiOperation({
    summary: 'Approve a payment',
    description:
      'Approves a payment by its unique identifier or external identifier',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The payment has been successfully approved.',
  })
  @ApiParam({
    name: 'idOrExternalId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'The payment with the specified ID or external ID was not found.',
  })
  async approvePayment(@Param('idOrExternalId') idOrExternalId: string) {
    return this.paymentsService.approvePayment({ idOrExternalId });
  }
}
